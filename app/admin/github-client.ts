const GITHUB_API = "https://api.github.com";
const REQUEST_TIMEOUT_MS = 30_000;

type GitHubErrorOptions = {
  status: number;
  message: string;
  details: string;
  githubMessage?: string;
  requestId?: string;
  acceptedPermissions?: string;
};

/** Safe diagnostic fields only: no request body, credentials or auth headers. */
export class GitHubApiError extends Error {
  readonly status: number;
  readonly details: string;
  readonly githubMessage: string;
  readonly requestId?: string;
  readonly acceptedPermissions?: string;

  constructor(options: GitHubErrorOptions) {
    super(options.message);
    this.name = "GitHubApiError";
    this.status = options.status;
    this.details = options.details;
    this.githubMessage = options.githubMessage ?? "";
    this.requestId = options.requestId;
    this.acceptedPermissions = options.acceptedPermissions;
  }
}

function safeText(value: string, token: string, maxLength = 1400) {
  const withoutToken = token ? value.split(token).join("[token rimosso]") : value;
  return withoutToken
    .replace(/(?:github_pat_|gh[pousr]_)[A-Za-z0-9_]+/gi, "[token rimosso]")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .slice(0, maxLength);
}

function readGitHubMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const data = payload as { message?: unknown; errors?: unknown };
  const parts = typeof data.message === "string" ? [data.message] : [];
  if (Array.isArray(data.errors)) {
    for (const error of data.errors.slice(0, 5)) {
      if (typeof error === "string") {
        parts.push(error);
      } else if (error && typeof error === "object") {
        const detail = error as { message?: unknown; code?: unknown };
        if (typeof detail.message === "string") parts.push(detail.message);
        if (typeof detail.code === "string") parts.push(detail.code);
      }
    }
  }
  return parts.join(" · ");
}

function errorExplanation(
  status: number,
  method: string,
  githubMessage: string,
  headers: Headers,
) {
  const writing = !["GET", "HEAD", "OPTIONS"].includes(method);
  const keepDraft = writing ? " Le modifiche restano nella dashboard: conserva la bozza." : "";
  if (status === 401) {
    return "GitHub non riconosce il token: potrebbe essere errato, scaduto o revocato. Inserisci un token valido nell'area Connessione." + keepDraft;
  }
  if (status === 403 || status === 429) {
    if (
      status === 429 ||
      headers.get("x-ratelimit-remaining") === "0" ||
      /secondary rate limit|rate limit exceeded|abuse detection/i.test(githubMessage)
    ) {
      return "GitHub ha temporaneamente limitato le richieste. Attendi prima di riprovare; non rigenerare il token per questo errore." + keepDraft;
    }
    if (/GH006|GH013|protected branch|repository rule|rule violation|branch protection/i.test(githubMessage)) {
      return "GitHub ha bloccato la modifica per una regola della repository o una protezione del branch. Controlla il dettaglio dell'errore e usa il percorso di aggiornamento richiesto dalla regola (ad esempio una pull request)." + keepDraft;
    }
    if (/resource not accessible by personal access token/i.test(githubMessage)) {
      return writing
        ? "GitHub rifiuta il salvataggio con questo token. Nelle impostazioni del token verifica Resource owner: PaoloSorino1, la repository paolo-sorino-portfolio selezionata e Contents: Read and write. Se hai creato un nuovo token, sostituiscilo nell'area Connessione: quello precedente resta attivo nella scheda finché non lo cambi. I permessi del tuo account non dimostrano quelli del token." + keepDraft
        : "GitHub rifiuta l'accesso con questo token. Verifica Resource owner: PaoloSorino1, la repository paolo-sorino-portfolio selezionata e almeno Contents: Read per leggerne i file. Per salvare occorre Contents: Read and write. Se hai generato un token nuovo, inseriscilo nell'area Connessione.";
    }
    return "GitHub ha negato questa operazione. Il messaggio ricevuto non permette di stabilire se dipende dai permessi del token, dalle regole dell'organizzazione o da un'altra restrizione. Controlla i dettagli diagnostici." + keepDraft;
  }
  if (status === 404) {
    return "GitHub non trova la risorsa oppure il token non può vederla. Verifica repository, branch e file richiesti; un 404 da solo non prova che il file sia assente." + keepDraft;
  }
  if (status === 409) {
    return "GitHub segnala un conflitto: il file o il branch potrebbero essere cambiati dopo il caricamento. Conserva la bozza e confrontala con la versione su GitHub prima di riallineare i dati. Le modifiche locali non sono state eliminate.";
  }
  if (status === 422) {
    if (/GH006|GH013|protected branch|repository rule|rule violation|branch protection/i.test(githubMessage)) {
      return "Una regola della repository o una protezione del branch impedisce il salvataggio. Controlla la regola indicata nei dettagli e il percorso di aggiornamento consentito." + keepDraft;
    }
    return "GitHub non ha accettato i dati della richiesta. Controlla nei dettagli il campo o il vincolo segnalato; non è necessariamente un problema di token." + keepDraft;
  }
  if (status >= 500) {
    return "GitHub ha restituito un errore del servizio." +
      (writing ? " Il salvataggio potrebbe avere un esito incerto: controlla i commit su GitHub prima di riprovare." : " Riprova tra poco.") + keepDraft;
  }
  return `GitHub ha risposto con errore ${status}. Controlla i dettagli diagnostici.` + keepDraft;
}

export async function githubRequest<T>(
  token: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  // Keep authorization on the one API origin, even if a future caller supplies a URL.
  if (!path.startsWith("/") || path.startsWith("//") || /[\\\u0000-\u0020\u007f]/.test(path)) {
    throw new GitHubApiError({ status: 0, message: "Percorso API GitHub non valido.", details: "La richiesta non è stata inviata." });
  }
  const url = new URL(path, GITHUB_API);
  if (url.origin !== GITHUB_API) {
    throw new GitHubApiError({ status: 0, message: "Destinazione API GitHub non valida.", details: "La richiesta non è stata inviata." });
  }

  const method = (init.method ?? "GET").toUpperCase();
  const endpoint = safeText(url.pathname, token);
  const requestDescription = `${method} ${endpoint}`;
  const headers = new Headers(init.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/vnd.github+json");
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("X-GitHub-Api-Version", "2026-03-10");
  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, REQUEST_TIMEOUT_MS);
  const abort = () => controller.abort();
  if (init.signal?.aborted) controller.abort();
  else init.signal?.addEventListener("abort", abort, { once: true });

  try {
    const response = await fetch(url.toString(), {
      ...init,
      headers,
      signal: controller.signal,
      redirect: "error",
    });
    const responseText = await response.text();
    let payload: unknown = null;
    let malformed = false;
    if (responseText.trim()) {
      try { payload = JSON.parse(responseText); }
      catch { malformed = true; }
    }
    const githubMessage = safeText(readGitHubMessage(payload), token);
    const requestId = safeText(response.headers.get("x-github-request-id") ?? "", token, 160) || undefined;
    const acceptedPermissions = safeText(response.headers.get("x-accepted-github-permissions") ?? "", token, 500) || undefined;
    const details = [
      requestDescription,
      `HTTP ${response.status}`,
      githubMessage ? `Messaggio GitHub: ${githubMessage}` : (malformed ? "Risposta GitHub non JSON." : "Nessun messaggio aggiuntivo da GitHub."),
      requestId ? `Request ID: ${requestId}` : null,
      acceptedPermissions ? `Permessi accettati (requisiti endpoint, non permessi token): ${acceptedPermissions}` : null,
    ].filter(Boolean).join("\n");

    if (!response.ok) {
      throw new GitHubApiError({ status: response.status, message: errorExplanation(response.status, method, githubMessage, response.headers), details, githubMessage, requestId, acceptedPermissions });
    }
    if (malformed) {
      throw new GitHubApiError({ status: response.status, message: "GitHub ha risposto, ma la risposta non è leggibile. Se stavi salvando, verifica i commit su GitHub prima di riprovare. Conserva la bozza.", details, requestId, acceptedPermissions });
    }
    return payload as T;
  } catch (error) {
    if (error instanceof GitHubApiError) throw error;
    const writing = !["GET", "HEAD", "OPTIONS"].includes(method);
    const reason = timedOut
      ? "La richiesta a GitHub ha superato il tempo di attesa."
      : controller.signal.aborted
        ? "La richiesta a GitHub è stata interrotta."
        : "Impossibile completare la richiesta a GitHub. Controlla la connessione ed eventuali blocchi del browser.";
    throw new GitHubApiError({
      status: 0,
      message: reason + (writing ? " L'esito del salvataggio è incerto: conserva la bozza e verifica i commit su GitHub prima di riprovare." : ""),
      details: `${requestDescription}\nNessuna risposta HTTP completa disponibile.`,
    });
  } finally {
    clearTimeout(timeout);
    init.signal?.removeEventListener("abort", abort);
  }
}
