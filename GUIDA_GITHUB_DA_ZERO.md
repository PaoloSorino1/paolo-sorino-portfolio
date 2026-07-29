# Pubblicare il portfolio su GitHub Pages

## Nome consigliato

Crea una repository pubblica chiamata:

`paolo-sorino-portfolio`

Il sito avrà questo indirizzo:

`https://paolosorino1.github.io/paolo-sorino-portfolio/`

GitHub usa l'indirizzo principale `https://paolosorino1.github.io/` soltanto per
una repository chiamata esattamente `PaoloSorino1.github.io`.

## Metodo A - caricamento dal browser

1. Accedi a GitHub.
2. Clicca `New repository`.
3. Inserisci `paolo-sorino-portfolio`.
4. Seleziona `Public`.
5. Non aggiungere README, `.gitignore` o licenza.
6. Clicca `Create repository`.
7. Nella repository vuota clicca `uploading an existing file`.
8. Estrai lo ZIP sul computer.
9. Apri la cartella estratta `paolo-sorino-portfolio`.
10. Trascina nel riquadro GitHub tutti gli elementi contenuti nella cartella,
    non la cartella contenitore.
11. Verifica che alla radice compaiano almeno `app`, `public`, `package.json`,
    `package-lock.json`, `next.config.ts` e `WORKFLOW_GITHUB_PAGES.yml`.
12. Scrivi `Initial premium portfolio` e clicca `Commit changes`.

### Se la cartella `.github` non viene caricata

È normale che macOS nasconda le cartelle che iniziano con un punto.

1. Apri la scheda `Actions`.
2. Clicca `set up a workflow yourself` oppure `create your own`.
3. Come nome file usa `deploy-pages.yml`.
4. Cancella il contenuto proposto.
5. Apri nel progetto il file visibile `WORKFLOW_GITHUB_PAGES.yml`.
6. Copia tutto il suo contenuto e incollalo nell'editor GitHub.
7. Clicca `Commit changes`.

GitHub salverà automaticamente il file nella posizione corretta:
`.github/workflows/deploy-pages.yml`.

## Metodo B - GitHub Desktop

Questo metodo carica automaticamente anche la cartella nascosta `.github`.

1. Estrai lo ZIP.
2. Apri GitHub Desktop.
3. Seleziona `File` -> `Add Local Repository`.
4. Scegli la cartella estratta `paolo-sorino-portfolio`.
5. Se viene indicato che non è una repository, scegli `create a repository`.
6. Inserisci come nome `paolo-sorino-portfolio`.
7. Crea il primo commit con messaggio `Initial premium portfolio`.
8. Clicca `Publish repository`.
9. Mantieni il nome `paolo-sorino-portfolio`.
10. Deseleziona `Keep this code private`.
11. Clicca `Publish Repository`.

## Attivare GitHub Pages

1. Apri la repository su GitHub.
2. Vai su `Settings`.
3. Nel menu a sinistra apri `Pages`.
4. In `Build and deployment`, imposta `Source` su `GitHub Actions`.
5. Non selezionare Jekyll e non configurare `Static HTML`.
6. Lascia vuoto `Custom domain`.

## Controllare il deployment

1. Apri la scheda `Actions`.
2. Seleziona `Deploy Paolo Sorino portfolio`.
3. Apri l'esecuzione più recente.
4. Attendi che entrambi i job siano verdi:
   - `build`
   - `deploy`
5. Il primo deployment richiede normalmente pochi minuti.
6. Apri il collegamento mostrato nel job `deploy`.

Se il workflow non parte, aprilo e usa:

`Run workflow` -> `main` -> `Run workflow`.

## Indirizzo finale

Con il nome consigliato:

`https://paolosorino1.github.io/paolo-sorino-portfolio/`

Al primo accesso esegui un aggiornamento forzato:

- macOS: `Cmd + Shift + R`
- Windows: `Ctrl + F5`

L'aggiornamento forzato è utile anche dopo il primo deploy per sostituire nella
scheda del browser il vecchio favicon azzurro con il nuovo monogramma `PS`.

## Controlli importanti

- `app` e `public` devono essere direttamente alla radice della repository.
- Non caricare `node_modules`, `.next` o `out`.
- Non modificare mai manualmente i file dentro `out`.
- Il workflow usa direttamente Node.js 22 e non richiede `.nvmrc`.
- I percorsi di immagini, loghi, CV e pagina Publications si adattano
  automaticamente al nome della repository.
- Deve esserci un solo workflow che effettua il deployment di GitHub Pages.
