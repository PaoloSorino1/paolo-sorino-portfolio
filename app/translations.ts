import type { Language } from "./language-context";

const italian: Record<string, string> = {
  "About": "Profilo",
  "Research": "Ricerca",
  "Projects": "Progetti",
  "Publications": "Pubblicazioni",
  "Teaching": "Didattica",
  "Primary navigation": "Navigazione principale",
  "Email Paolo Sorino": "Invia un’e-mail a Paolo Sorino",
  "Postdoctoral": "Ricercatore",
  "Researcher": "Postdoc",
  "Designing explainable, human-centred AI for healthcare.":
    "Progetto sistemi di IA spiegabili e centrati sulle persone per la sanità.",
  "Explore research": "Esplora la ricerca",
  "View publications": "Vedi le pubblicazioni",
  "Research focus": "Ambiti di ricerca",
  "Research atlas": "Atlante della ricerca",
  "Artificial Intelligence": "Intelligenza artificiale",
  "Machine Learning": "Machine learning",
  "AI in Healthcare": "IA per la sanità",
  "AI and Machine Learning in Healthcare":
    "IA e machine learning per la sanità",
  "Explainable AI": "IA spiegabile",
  "Healthcare": "Sanità",
  "Knowledge Graphs": "Knowledge graph",
  "Clinical Decision Support": "Supporto alle decisioni cliniche",
  "Healthcare · XAI · HMI": "Sanità · XAI · HMI",
  "Three connected perspectives.": "Tre prospettive connesse.",
  "From model development to explanation and interaction, each line of research is grounded in responsible, clinically meaningful use.":
    "Dallo sviluppo dei modelli alla spiegazione e all’interazione, ogni linea di ricerca è orientata a un uso responsabile e clinicamente significativo.",
  "Explainable AI in Healthcare": "IA spiegabile in sanità",
  "Interpretable machine learning and deep learning methods that make clinical predictions transparent, inspectable, and actionable.":
    "Metodi interpretabili di machine learning e deep learning che rendono le predizioni cliniche trasparenti, verificabili e utilizzabili.",
  "AI for Clinical Decision Support":
    "IA per il supporto alle decisioni cliniche",
  "Human-centred predictive systems for risk assessment, patient stratification, and evidence-informed clinical workflows.":
    "Sistemi predittivi centrati sulle persone per la valutazione del rischio, la stratificazione dei pazienti e i flussi clinici basati sulle evidenze.",
  "Human–Machine Interaction": "Interazione uomo–macchina",
  "Interfaces and interaction models that help people understand, question, and confidently use intelligent systems.":
    "Interfacce e modelli di interazione che aiutano le persone a comprendere, interrogare e usare con consapevolezza i sistemi intelligenti.",
  "Secondary research lines": "Linee di ricerca complementari",
  "Graph learning & knowledge graphs · Multimodal and privacy-aware AI · Brain–computer interfaces & biosignals":
    "Graph learning e knowledge graph · IA multimodale e attenta alla privacy · Interfacce cervello–computer e biosignali",
  "Academic highlights": "Principali risultati accademici",
  "Scientific publications": "Pubblicazioni scientifiche",
  "Supervised theses": "Tesi supervisionate",
  "Research projects": "Progetti di ricerca",
  "Granted national patent": "Brevetto nazionale concesso",
  "Research at the intersection of": "Ricerca all’intersezione tra",
  "intelligence, health, and people.": "intelligenza, salute e persone.",
  "I am a postdoctoral researcher at the Department of Electrical and Information Engineering of Politecnico di Bari, and a member of SisInfLab.":
    "Sono ricercatore postdoc presso il Dipartimento di Ingegneria Elettrica e dell’Informazione del Politecnico di Bari e membro del SisInfLab.",
  "My work connects artificial intelligence with real healthcare needs: building predictive methods, making their reasoning understandable, and designing interaction models that support informed human decisions.":
    "La mia ricerca collega l’intelligenza artificiale ai bisogni concreti della sanità: sviluppo metodi predittivi, ne rendo comprensibile il ragionamento e progetto modelli di interazione che supportano decisioni umane consapevoli.",
  "View institutional profile": "Vedi il profilo istituzionale",
  "From methods to deployed research.": "Dai metodi alla ricerca applicata.",
  "I contribute to interdisciplinary projects where AI must remain scientifically rigorous, understandable, and useful to the people who rely on it.":
    "Contribuisco a progetti interdisciplinari nei quali l’IA deve restare scientificamente rigorosa, comprensibile e utile alle persone che la utilizzano.",
  "Additional collaborations include LIFE, MISTRAL, and DEMETRA.":
    "Ulteriori collaborazioni includono LIFE, MISTRAL e DEMETRA.",
  "Principal Investigator": "Responsabile scientifico",
  "Work-Package Leader": "Responsabile del work package",
  "Competitive allocation of national high-performance computing resources for large-scale research in artificial intelligence and data science.":
    "Assegnazione competitiva di risorse nazionali di calcolo ad alte prestazioni per attività di ricerca su larga scala in intelligenza artificiale e data science.",
  "Technical and scientific coordination of AI, federated learning, XAI, intelligent robotics, sensing, and the integrated One Health platform.":
    "Coordinamento tecnico e scientifico di IA, federated learning, XAI, robotica intelligente, sensing e della piattaforma integrata One Health.",
  "AI and explainability pipelines connecting genotype, phenotype, and multi-omics data for biomarker discovery and varietal classification.":
    "Pipeline di IA e spiegabilità che collegano dati genotipici, fenotipici e multi-omici per la scoperta di biomarcatori e la classificazione varietale.",
  "AI/XAI methods and interactive systems for early detection, biological treatments, and collaborative research in plant health.":
    "Metodi di IA/XAI e sistemi interattivi per la diagnosi precoce, i trattamenti biologici e la ricerca collaborativa nella salute delle piante.",
  "Competitive grant": "Finanziamento competitivo",
  "Healthcare AI · XAI": "IA per la sanità · XAI",
  "AI · Multi-omics": "IA · Multi-omica",
  "XAI · Interactive systems": "XAI · Sistemi interattivi",
  "2024—present": "2024—oggi",
  "Selected publications": "Pubblicazioni selezionate",
  "Research, made readable.": "Ricerca, resa comprensibile.",
  "Complete publication list": "Elenco completo delle pubblicazioni",
  "Journal article": "Articolo su rivista",
  "Conference paper": "Articolo in conferenza",
  "Graph AI · Healthcare benchmarking":
    "Graph AI · Benchmarking in sanità",
  "Explainable AI · Alzheimer’s disease":
    "IA spiegabile · Malattia di Alzheimer",
  "Clinical prediction · XAI": "Predizione clinica · XAI",
  "Human-centred AI · HMI": "IA centrata sulle persone · HMI",
  "Teaching & supervision": "Didattica e supervisione",
  "Making complex ideas": "Trasformare idee complesse",
  "work in practice.": "in soluzioni concrete.",
  "Teaching connects my research to the next generation of engineers: from machine learning foundations to software design and applied artificial intelligence.":
    "La didattica collega la mia ricerca alla prossima generazione di ingegneri: dai fondamenti del machine learning alla progettazione del software e all’intelligenza artificiale applicata.",
  "Adjunct Professor": "Docente a contratto",
  "Adjunct Professor · Module E": "Docente a contratto · Modulo E",
  "Assistant Lecturer": "Assistente alla docenza",
  "Software Design Laboratory": "Laboratorio di Progettazione del Software",
  "2nd-Level Master’s Degree in Artificial Intelligence and Data Science":
    "Master di II livello in Intelligenza Artificiale e Data Science",
  "Foundations of Machine Learning": "Fondamenti di Machine Learning",
  "Bachelor’s degree in Medical Systems Engineering · Politecnico di Bari":
    "Laurea in Ingegneria dei Sistemi Medicali · Politecnico di Bari",
  "Politecnico di Bari · 200 hours of lectures, laboratory sessions, and tutoring":
    "Politecnico di Bari · 200 ore di lezioni, laboratori e tutoraggio",
  "Master’s degree in Computer Engineering · Politecnico di Bari":
    "Laurea magistrale in Ingegneria Informatica · Politecnico di Bari",
  "Hours of specialist training": "Ore di formazione specialistica",
  "Bachelor’s and Master’s theses supervised":
    "Tesi di laurea e laurea magistrale supervisionate",
  "Academic service": "Servizio accademico",
  "Contributing beyond publications.":
    "Contribuire oltre le pubblicazioni.",
  "Editorial": "Attività editoriale",
  "Editorial board": "Comitato editoriale",
  "Associate Editor": "Associate Editor",
  "IEEE Journal of Biomedical and Health Informatics (J-BHI) · Public Health Informatics Section · Q1 journal.":
    "IEEE Journal of Biomedical and Health Informatics (J-BHI) · Sezione Public Health Informatics · Rivista scientifica Q1.",
  "Guest Editor": "Guest Editor",
  "Research community": "Comunità scientifica",
  "International engagement": "Impegno internazionale",
  "Invited lectures, workshop organization, programme committees, and session leadership across AI, HMI, and healthcare research.":
    "Lezioni su invito, organizzazione di workshop, comitati di programma e coordinamento di sessioni scientifiche su IA, HMI e ricerca sanitaria.",
  "Innovation": "Innovazione",
  "Granted patent": "Brevetto concesso",
  "Machine-learning method for validating NAFLD diagnosis without imaging technologies.":
    "Metodo di machine learning per validare la diagnosi di NAFLD senza tecnologie di imaging.",
  "Invited talks & lectures": "Invited talk e lezioni",
  "International invitations spanning explainable healthcare AI, human–machine systems, and brain–computer interaction.":
    "Inviti internazionali sui temi dell’IA spiegabile per la sanità, dei sistemi uomo–macchina e delle interfacce cervello–computer.",
  "Nanyang Technological University, Singapore · 1–3 July 2026":
    "Nanyang Technological University, Singapore · 1–3 luglio 2026",
  "27th Workshop “From Objects to Agents” · Salerno · 17 June 2026":
    "27° Workshop “From Objects to Agents” · Salerno · 17 giugno 2026",
  "Special event: Integrative Approaches to EEG Signal Analysis":
    "Evento speciale: approcci integrati all’analisi dei segnali EEG",
  "Hosted by University of Naples Federico II · 10–13 December 2024":
    "Ospitato dall’Università degli Studi di Napoli Federico II · 10–13 dicembre 2024",
  "Workshop on enabling technologies for paediatric rehabilitation · Ioannina, Greece · 27–30 September 2022":
    "Workshop sulle tecnologie abilitanti per la riabilitazione pediatrica · Ioannina, Grecia · 27–30 settembre 2022",
  "Open the event website": "Apri il sito dell’evento",
  "Let’s connect": "Contatti",
  "Interested in explainable,": "Ti interessa un’IA spiegabile,",
  "human-centred": "centrata sulle persone",
  "healthcare AI?": "per la sanità?",
  "I am open to research collaborations, invited talks, and projects that bring transparent AI into meaningful real-world settings.":
    "Sono disponibile per collaborazioni di ricerca, invited talk e progetti che portino un’IA trasparente in contesti reali e significativi.",
  "Download full CV": "Scarica il CV completo",
  "Full academic CV · updated August 2026 · PDF":
    "CV accademico completo · aggiornato ad agosto 2026 · PDF",
  "Complete bibliography": "Bibliografia completa",
  "Back to portfolio": "Torna al portfolio",
  "Publications,": "Pubblicazioni,",
  "with direct access.": "con accesso diretto.",
  "The complete publication list from my current academic CV. Every DOI opens the canonical publication record; entries without a DOI point to the official proceedings page.":
    "L’elenco completo delle pubblicazioni tratto dal mio CV accademico aggiornato. Ogni DOI apre il record canonico della pubblicazione; le voci prive di DOI rimandano alla pagina ufficiale degli atti.",
  "Academic profiles": "Profili accademici",
  "Publication categories": "Categorie delle pubblicazioni",
  "Journal articles": "Articoli su rivista",
  "Conferences & workshops": "Conferenze e workshop",
  "Publication overview": "Panoramica delle pubblicazioni",
  "Conference & workshop papers":
    "Articoli in conferenze e workshop",
  "Publication period": "Periodo di pubblicazione",
  "Conference & workshop publications":
    "Pubblicazioni in conferenze e workshop",
  "records": "voci",
  "Official record": "Record ufficiale",
  "Publisher page": "Pagina dell’editore",
  "Bibliography based on the current academic CV. DOI and publisher links have been individually verified.":
    "Bibliografia basata sul CV accademico aggiornato. I DOI e i collegamenti agli editori sono stati verificati singolarmente.",
  "Return to portfolio": "Torna al portfolio",
};

export function translate(language: Language, text: string) {
  return language === "it" ? (italian[text] ?? text) : text;
}
