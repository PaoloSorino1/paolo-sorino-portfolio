# Paolo Sorino - Research Portfolio

Portfolio accademico responsive realizzato con Next.js, React e TypeScript.

## Contenuti

- homepage editoriale in stile premium, ottimizzata anche per smartphone da
  320 px senza scorrimento orizzontale;
- layout `Editorial Tech Split` con palette blu scientifica `#0d5194`,
  tipografia Poppins e titoli editoriali;
- hero con ritratto di Paolo scontornato e integrato nel collage scientifico,
  senza sfondo fotografico rettangolare;
- switch persistente `EN / IT` che traduce homepage e pagina Publications;
- Research Visual Atlas con ritratto editoriale, grafici scientifici discreti e
  topic bubble responsive per AI in Healthcare, Machine Learning, XAI, HMI e
  Clinical Decision Support;
- card delle tre prospettive di ricerca ridisegnate con finitura premium,
  angoli arrotondati e layout mobile a colonna;
- XAI in healthcare, AI in healthcare e Human-Machine Interaction;
- progetti, teaching e academic service;
- esperienza didattica nel Master di II livello in Artificial Intelligence and
  Data Science, Module E, per 200 ore;
- sezione completa con 5 invited talks e lecture internazionali;
- 43 pubblicazioni: 21 journal e 22 conference/workshop;
- 41 DOI cliccabili e 2 link ufficiali CEUR-WS;
- profili ORCID, Google Scholar, Scopus, GitHub e LinkedIn;
- un solo ritratto hero trasparente e CV completo scaricabile;
- favicon personalizzato con monogramma `PS` in stile blu scientifico;
- SEO tecnico completo con canonical URL, sitemap, robots, verifica Google
  Search Console e dati strutturati `ProfilePage` / `Person`;
- esportazione statica e workflow GitHub Pages già configurati;
- gestione automatica del percorso della repository GitHub.

## Avvio locale

Richiede Node.js 22.

```bash
npm install
npm run dev
```

Aprire `http://localhost:3000`.

## Controlli

```bash
npm run lint
npm run build
```

## Pubblicazione

La procedura completa è in `GUIDA_GITHUB_DA_ZERO.md`.

Nome repository consigliato: `paolo-sorino-portfolio`.

Con questo nome il sito sarà disponibile su:

`https://paolosorino1.github.io/paolo-sorino-portfolio/`

Il workflow calcola automaticamente il percorso tecnico corretto. Se la
repository viene rinominata, aggiornare anche `SITE_URL` in
`app/site-config.ts` per mantenere corretti canonical, sitemap e dati
strutturati.

## Indicizzazione Google

Dopo il deployment:

1. aprire Google Search Console;
2. verificare la proprietà con prefisso URL
   `https://paolosorino1.github.io/paolo-sorino-portfolio/`;
3. inviare la sitemap
   `https://paolosorino1.github.io/paolo-sorino-portfolio/sitemap.xml`;
4. usare Controllo URL per richiedere l'indicizzazione della homepage e di
   `/publications/`.

Il tag di verifica Google è già configurato nel progetto.
