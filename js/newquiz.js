// Fonction pour générer un nouveau quiz
async function generateQuiz() {
    const quizTitle = document.getElementById('quizTitle').value;
    const facileInput = document.getElementById('facileInput').value;
    const moyenInput = document.getElementById('moyenInput').value;
    const difficileInput = document.getElementById('difficileInput').value;

    // Vérifier si un titre a été saisi
    if (quizTitle.trim() === '') {
        alert('Veuillez saisir un titre pour le quiz.');
        return;
    }

    const data = {
        title: quizTitle,
        facile: facileInput,
        moyen: moyenInput,
        difficile: difficileInput
    };

    try {
        const response = await fetch('http://localhost:8080/TPRestAPIFinal_war_exploded/api/system/quiz/' + quizTitle, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const quiz = await response.json();
            document.getElementById('result').innerText = `Quiz créé avec succès! ID: ${quiz.quizId}`;
            
            // Appeler addRandomQuestionsForQuiz pour ajouter des questions au quiz
            await addQuestionsToQuiz(quiz.quizId, data);
        } else {
            const errorMessage = await response.text();
            document.getElementById('result').innerText = `Erreur: ${errorMessage}`;
        }
    } catch (error) {
        console.error('Erreur lors de la création du quiz:', error);
        document.getElementById('result').innerText = 'Une erreur est survenue lors de la création du quiz.';
    }
}

// Fonction pour ajouter des questions au quiz avec addRandomQuestionsForQuiz
async function addQuestionsToQuiz(quizId, quizData) {
    const { facile, moyen, difficile } = quizData;
    try {
        await fetch(`http://localhost:8080/TPRestAPIFinal_war_exploded/api/system/quiz/${quizId}/questions/${facile}/facile`, {
            method: 'POST'
        });
        await fetch(`http://localhost:8080/TPRestAPIFinal_war_exploded/api/system/quiz/${quizId}/questions/${moyen}/moyen`, {
            method: 'POST'
        });
        await fetch(`http://localhost:8080/TPRestAPIFinal_war_exploded/api/system/quiz/${quizId}/questions/${difficile}/difficile`, {
            method: 'POST'
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout des questions au quiz:', error);
    }
}
    
// Fonction pour le bouton Annuler de la page 'newquiz.html'.
function cancelQuiz() {
    // Effacer les valeurs saisies dans les champs de texte
    document.getElementById('quizTitle').value = '';
    document.getElementById('facileInput').value = '';
    document.getElementById('moyenInput').value = '';
    document.getElementById('difficileInput').value = '';
    
    // Effacer le résultat affiché
    document.getElementById('result').innerText = '';
}