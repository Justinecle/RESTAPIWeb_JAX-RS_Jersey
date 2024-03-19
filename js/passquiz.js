// Fonction pour charger les quiz non utilisés
async function loadUnusedQuizzes() {
    const response = await fetch('http://localhost:8080/TPRestAPIFinal_war_exploded/api/system/notusedquizzes')
    const unusedQuizzes = await response.json();
    return unusedQuizzes
}

// Appel de la fonction pour récupérer les quizzes et les afficher
loadUnusedQuizzes().then(unusedQuizzes => {
    console.log(unusedQuizzes)
    let quizSelect = document.getElementById('quizSelect')
    if (quizSelect != null) {
        unusedQuizzes.forEach(quiz => {
            const option = document.createElement('option');
            option.value = quiz.quizId;
            option.textContent = quiz.titre;
            quizSelect.appendChild(option);
        })
    }    
})

// Événement de clic sur le bouton pour passer le quiz
let passQuizBtn = document.getElementById('passQuizBtn');
if (passQuizBtn != null) {
    passQuizBtn.addEventListener('click', function () {
        // Récupère l'ID du quiz sélectionné dans le menu déroulant
        const quizSelect = document.getElementById('quizSelect');
        const selectedQuizId = quizSelect.value;
        if (selectedQuizId) {
            // Redirige vers la page answers to quiz avec l'ID du quiz dans l'URL
            window.location.href = `answerstoquiz.html?id=${selectedQuizId}`;
        } else {
            alert('Veuillez sélectionner un quiz.');
        }
    });
}

// Fonction pour annuler et retourner à la page d'accueil
function cancel() {
    // Rediriger l'utilisateur vers la page d'accueil
    window.location.href = 'index.html';
}
