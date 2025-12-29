describe("Flux Complet Utilisateur DataShare", () => {
  const timestamp = Date.now();
  const user = {
    email: `cypress_${timestamp}@test.com`,
    password: "Password123!",
    filename: "mon-fichier-test.txt",
    fileContent: "Ceci est le contenu du fichier uploadé via Cypress.",
  };

  it("Scénario complet : Inscription -> Login -> Upload -> Accès -> Suppression -> Logout", () => {
    // ======================================================
    // 1. REGISTER (Inscription)
    // ======================================================

    // Navigation vers la page d'inscription
    cy.visit("/signup");

    // Remplissage du formulaire
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').first().type(user.password);
    cy.get('input[type="password"]').eq(1).type(user.password);

    // Soumission
    cy.get('button[type="submit"]').click();

    // Assertion : Redirection vers /login attendue
    cy.url().should("include", "/login");

    // ======================================================
    // 2. LOGIN (Connexion)
    // ======================================================

    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').type(user.password);
    cy.get('button[type="submit"]').click();

    // Assertion : Redirection vers /dashboard
    cy.url().should("include", "/dashboard");
    cy.contains("h2", "Mes fichiers").should("be.visible");

    // ======================================================
    // 3. UPLOAD (Téléversement)
    // ======================================================

    // Ouvrir la modale d'upload en déclenchant l'événement custom
    cy.window().then((win) => {
      win.dispatchEvent(new CustomEvent("open-upload-modal"));
    });

    // Vérifier que la modale est ouverte
    cy.get(".file-card")
      .should("be.visible")
      .and("contain", "Ajouter un fichier");

    // Simulation de l'upload via l'input caché (ref={hiddenFileInput})
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from(user.fileContent),
        fileName: user.filename,
        mimeType: "text/plain",
        lastModified: Date.now(),
      },
      { force: true }
    );

    // Vérification que le nom du fichier s'affiche dans la modale
    cy.get(".file-name").should("contain", user.filename);

    // Clic sur "Téléverser" (AppButton)
    cy.contains("button", "Téléverser").click();

    // Assertion : Le mode passe à "success"
    // Le bouton change de texte pour devenir "Copier le lien"
    cy.contains("button", "Copier le lien").should("be.visible");

    // Fermeture de la modale via Echap
    cy.get("body").trigger("keydown", { key: "Escape" });

    // ======================================================
    // 4. LISTING (Vérification Dashboard)
    // ======================================================

    // On attend que la liste se mette à jour et contienne le fichier
    cy.contains(".file-row", user.filename).should("be.visible");

    // ======================================================
    // 5. DOWNLOAD PAGE (Accès au fichier)
    // ======================================================

    // On cherche le bouton "Accéder →" DANS la ligne du fichier spécifique
    cy.contains(".file-row", user.filename)
      .find("button")
      .contains("Accéder →")
      .click();

    // Assertion : URL doit contenir /files/ et l'ID
    cy.url().should("include", "/files/");

    // Vérification de la page de téléchargement
    cy.contains("h2", "Télécharger un fichier").should("be.visible");
    cy.contains(".file-name", user.filename).should("be.visible");

    // Vérifier que le bouton Télécharger est là
    cy.contains("button", "Télécharger").should("be.visible");

    // Retour au Dashboard pour la suite
    cy.go("back");

    // ======================================================
    // 6. DELETE (Suppression)
    // ======================================================

    // On clique sur "Supprimer" pour notre fichier
    cy.contains(".file-row", user.filename)
      .find("button")
      .contains("Supprimer")
      .click();

    // Confirmation de la modale
    cy.get(".modal-card-wrapper").should("be.visible");

    // Clic sur le bouton de confirmation
    cy.get(".modal-card-wrapper button")
      .contains(/Supprimer|Confirmer/i)
      .click();

    // Assertion : Toast de succès
    cy.contains(
      ".Toastify__toast--success",
      "Fichier supprimé avec succès"
    ).should("be.visible");

    // Assertion : Le fichier ne doit plus être dans la liste
    cy.contains(".file-row", user.filename).should("not.exist");

    // ======================================================
    // 7. LOGOUT (Déconnexion)
    // ======================================================

    // Clic sur le bouton de déconnexion
    cy.contains("button", /Déconnexion|Logout/i).click({ force: true });

    // Assertion : Retour à /login
    cy.url().should("include", "/login");
  });
});
