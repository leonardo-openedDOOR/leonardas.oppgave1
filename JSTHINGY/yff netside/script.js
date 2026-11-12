
// HTML ELEMENTS
const loggForm = document.querySelector("#loggForm");
const loggListe = document.querySelector("#loggListe");
const totalTimer = document.querySelector("#totalTimer");
const totalLogger = document.querySelector("#totalLogger");
const totalProsjekter = document.querySelector("#totalProsjekter");

const redigerId = document.querySelector("#redigerId");
const lagreKnapp = document.querySelector("#lagreKnapp");
const avbrytKnapp = document.querySelector("#avbrytKnapp");
const eksporterKnapp = document.querySelector("#eksporterKnapp");

// LOAD SAVED DATA
let logger = [];

try {
    const lagret = JSON.parse(localStorage.getItem("yffLogger"));
    if (Array.isArray(lagret)) {
        logger = lagret;
    }
} catch (error) {
    console.error("Kunne ikke lese lagrede logger:", error);
}

// SAVE DATA
function lagreData() {
    try {
        localStorage.setItem("yffLogger", JSON.stringify(logger));
        return true;
    } catch (error) {
        alert("Kunne ikke lagre data. Eksporter en sikkerhetskopi.");
        return false;
    }
}

// CREATE A TEXT ELEMENT
function lagTekstElement(type, tekst) {
    const element = document.createElement(type);
    element.textContent = tekst;
    return element;
}

// DISPLAY ALL LOGS
function visLogger() {
    loggListe.replaceChildren();

    if (logger.length === 0) {
        loggListe.appendChild(
            lagTekstElement("p", "Ingen loggføringer ennå.")
        );
        return;
    }

    // Newest date first
    const sorterteLogger = [...logger].sort((a, b) =>
        b.dato.localeCompare(a.dato)
    );

    sorterteLogger.forEach(function(logg) {
        const kort = document.createElement("article");
        kort.className = "logg-kort";

        const tittel = lagTekstElement("h3", logg.oppgave);

        const detaljer = lagTekstElement(
            "p",
            logg.dato + " | " + logg.timer +
            " timer | " + logg.kategori
        );

        const beskrivelse = lagTekstElement(
            "p",
            "Arbeid: " + logg.beskrivelse
        );

        const laering = lagTekstElement(
            "p",
            "Dette lærte jeg: " + (logg.laering || "Ikke fylt ut")
        );

        const handlinger = document.createElement("div");
        handlinger.className = "logg-actions";

        const redigerKnapp = document.createElement("button");
        redigerKnapp.textContent = "Rediger";
        redigerKnapp.type = "button";
        redigerKnapp.className = "secondary";

        redigerKnapp.addEventListener("click", function() {
            redigerLogg(logg.id);
        });

        const slettKnapp = document.createElement("button");
        slettKnapp.textContent = "Slett";
        slettKnapp.type = "button";
        slettKnapp.className = "danger";

        slettKnapp.addEventListener("click", function() {
            slettLogg(logg.id);
        });

        handlinger.append(redigerKnapp, slettKnapp);

        kort.append(
            tittel,
            detaljer,
            beskrivelse,
            laering,
            handlinger
        );

        loggListe.appendChild(kort);
    });
}

// UPDATE DASHBOARD
function oppdaterDashboard() {
    let timerSum = 0;

    logger.forEach(function(logg) {
        timerSum += Number(logg.timer) || 0;
    });

    totalTimer.textContent = timerSum.toLocaleString("nb-NO");
    totalLogger.textContent = logger.length;
    totalProsjekter.textContent = "0";
}

// RESET FORM
function nullstillSkjema() {
    loggForm.reset();
    redigerId.value = "";
    lagreKnapp.textContent = "Lagre logg";
    avbrytKnapp.hidden = true;
}

// ADD OR UPDATE A LOG
loggForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const dato = document.querySelector("#dato").value;
    const oppgave = document.querySelector("#oppgave").value.trim();
    const timer = Number(document.querySelector("#timer").value);
    const kategori = document.querySelector("#kategori").value;
    const beskrivelse = document.querySelector("#beskrivelse").value.trim();
    const laering = document.querySelector("#laering").value.trim();

    if (!dato || !oppgave || !beskrivelse ||
        !Number.isFinite(timer) || timer < 0.5) {
        alert("Fyll inn alle obligatoriske felt riktig.");
        return;
    }

    const gammelId = redigerId.value;

    const nyLogg = {
        id: gammelId || crypto.randomUUID(),
        dato: dato,
        oppgave: oppgave,
        timer: timer,
        kategori: kategori,
        beskrivelse: beskrivelse,
        laering: laering
    };

    const gamleLogger = [...logger];

    if (gammelId) {
        logger = logger.map(function(logg) {
            return logg.id === gammelId ? nyLogg : logg;
        });
    } else {
        logger.push(nyLogg);
    }

    if (!lagreData()) {
        logger = gamleLogger;
        return;
    }

    visLogger();
    oppdaterDashboard();
    nullstillSkjema();
});

// EDIT AN EXISTING LOG
function redigerLogg(id) {
    const logg = logger.find(function(item) {
        return item.id === id;
    });

    if (!logg) return;

    redigerId.value = logg.id;
    document.querySelector("#dato").value = logg.dato;
    document.querySelector("#oppgave").value = logg.oppgave;
    document.querySelector("#timer").value = logg.timer;
    document.querySelector("#kategori").value = logg.kategori;
    document.querySelector("#beskrivelse").value = logg.beskrivelse;
    document.querySelector("#laering").value = logg.laering;

    lagreKnapp.textContent = "Lagre endringer";
    avbrytKnapp.hidden = false;

    document.querySelector("#praksislogg").scrollIntoView({
        behavior: "smooth"
    });
}

// DELETE A LOG
function slettLogg(id) {
    const bekreftet = confirm(
        "Er du sikker på at du vil slette denne loggen?"
    );

    if (!bekreftet) return;

    const gamleLogger = [...logger];
    logger = logger.filter(function(logg) {
        return logg.id !== id;
    });

    if (!lagreData()) {
        logger = gamleLogger;
        return;
    }

    if (redigerId.value === id) {
        nullstillSkjema();
    }

    visLogger();
    oppdaterDashboard();
}

// CANCEL EDITING
avbrytKnapp.addEventListener("click", nullstillSkjema);

// EXPORT LOGS AS JSON
eksporterKnapp.addEventListener("click", function() {
    const data = JSON.stringify(logger, null, 2);
    const fil = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(fil);

    const lenke = document.createElement("a");
    lenke.href = url;
    lenke.download = "yff-praksislogg.json";

    document.body.appendChild(lenke);
    lenke.click();
    lenke.remove();

    URL.revokeObjectURL(url);
});

// INITIAL DISPLAY
visLogger();
oppdaterDashboard();
