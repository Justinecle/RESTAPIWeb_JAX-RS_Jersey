// Retrouve le quiz ID à partir de l'URL
const urlParams = new URLSearchParams(window.location.search)
const idQuizToAnswer = urlParams.get('id')

if (idQuizToAnswer != null) {
    // Récupère les questions du quiz depuis l'API
    fetch(`http://localhost:8080/TPRestAPIFinal_war_exploded/api/system/quiz/${idQuizToAnswer}/questions`, { method: 'GET', headers: { "Content-Type": "application/json" } })
        .then(resp => resp.json())
        .then(async data => {
            id.innerHTML = idQuizToAnswer;
            let questions = document.getElementById('questions');
            if (questions != null) {
                for (const question of data) {
                    // Récupère l'option sélectionnée pour chaque question
                    const selectedOptionId = await getOptionAnswered(idQuizToAnswer, question.questionId);
                    // Génère le code HTML des options pour chaque question
                    const optionsHtml = await renderOptions(question.questionId, selectedOptionId);
                    questions.innerHTML += `
                        <div>
                            <p class="mb-2">${question.enonce}</p>
                            <div class="border p-3 mb-4" id="options-${question.questionId}">
                                ${optionsHtml}
                            </div>
                        </div>
                    `;
                    const referringPage = document.referrer

                    // Si la page est "reviewquiz.html", on masque le bouton de soumission
                    if (referringPage.includes("reviewquiz.html")) {
                        document.getElementById('btn_submit').style.display = 'none'
                        document.getElementById('btn_retour').href = "reviewquiz.html"
                        // Vérifie si la réponse sélectionnée est correcte et met en évidence la question
                        const isCorrect = selectedOptionId !== null ? await verifyAnswer(question.questionId, selectedOptionId) : false;
                        const correctOptionId = await getCorrectOptionId(question.questionId)
                        highlightQuestionDiv(question.questionId, isCorrect, correctOptionId)
                    }
                }
            } 
        })
        .catch(error => console.error('Error fetching quiz questions:', error))
}

// Fonction pour générer le code HTML des options de réponse de la question
async function renderOptions(questionId, selectedOptionId) {
    console.log("Option sélectionnée pour la question", questionId, ":", selectedOptionId);
    const options = await getOptionsforQuestions(questionId)
    let optionsHtml = ''
    options.forEach(option => {
        optionsHtml += `
            <input type="radio" id="${option.optionId}" name="question-${questionId}" ${option.optionId === selectedOptionId ? 'checked' : ''}>
            <label for="${option.optionId}" id="${option.optionId}">${option.texte}</label>
            <br>
        `
    })
    return optionsHtml
}

// Fonction pour récupérer les options de réponse d'une question depuis l'API
async function getOptionsforQuestions(questionId) {
    const response = await fetch(`http://localhost:8080/TPRestAPIFinal_war_exploded/api/system/questions/${questionId}/options`, { method: 'GET', headers: { "Content-Type": "application/json" } })
    const data = await response.json()
    return data
}

// Fonction pour récupérer l'option sélectionnée d'une question depuis l'API
async function getOptionAnswered(quizId, questionId) {
    const response = await fetch(`http://localhost:8080/TPRestAPIFinal_war_exploded/api/system/quiz/${quizId}/question/${questionId}`, { method: 'GET', headers: { "Content-Type": "application/json" } })
    const data = await response.json()
    console.log("Option sélectionnée pour la question", questionId, ":", data.selectedOptionId);
    console.log("Données reçues pour la question", questionId, ":", data);
    return data.selectedOptionId;
}

// Fonction pour soumettre toutes les réponses
async function submitAllAnswers() {
    const questions = document.querySelectorAll('[id^="options-"]');
    let allAnswered = true;
    for (const questionDiv of questions) {
        const selectedOption = questionDiv.querySelector('input[type="radio"]:checked');
        if (!selectedOption) {
            allAnswered = false;
            document.getElementById('message').textContent = "Veuillez répondre à toutes les questions avant de soumettre.";
        }
    }
    if (allAnswered) {
        for (const questionDiv of questions) {
            const questionId = questionDiv.id.split('-')[1];
            const selectedOptionId = questionDiv.querySelector('input[type="radio"]:checked').id;
            await submitAnswer(questionId, selectedOptionId, questionDiv);
            document.getElementById('btn_submit').style.display = 'none';
            document.getElementById('message').textContent = '';
        }
    }
}

// Fonction pour soumettre une réponse à une question et afficher le résultat en vert ou rouge
async function submitAnswer(questionId, selectedOptionId, questionDiv) {
    const response = await fetch(`http://localhost:8080/TPRestAPIFinal_war_exploded/api/system/quiz/${idQuizToAnswer}/question/${questionId}/answer/${selectedOptionId}`, { method: 'PUT', headers: { "Content-Type": "application/json" } });
    const data = await response.json();
    const isCorrect = await verifyAnswer(questionId, selectedOptionId);
    if (isCorrect) {
        questionDiv.style.boxShadow = '0 0 10px rgba(40, 167, 69, 0.5)';
    } else {
        questionDiv.style.boxShadow = '0 0 10px rgba(220, 53, 69, 0.5)';
    }
}

// Événement lorque l'on clique sur le bouton 'Soumettre'
let btnSubmit = document.getElementById('btn_submit')
if (btnSubmit != null) {
    btnSubmit.addEventListener('click', function () {
        submitAllAnswers()
    })
}

// Fonction pour mettre en avant la bonne réponse
async function highlightQuestionDiv(questionId, isCorrect, correctOptionId) {
    console.log("Question", questionId, "- Est correcte :", isCorrect, "- Option correcte :", correctOptionId);
    const questionDiv = document.getElementById(`options-${questionId}`)
    const options = questionDiv.querySelectorAll('input[type="radio"]')
    
    if (isCorrect) {
        questionDiv.style.boxShadow = '0 0 10px rgba(40, 167, 69, 0.5)'
    } else {
        options.forEach(option => {
            if (option.id != correctOptionId) {
                option.nextElementSibling.style.color = 'black'
            } else {
                option.nextElementSibling.style.color = 'rgba(40, 167, 69, 0.7)'
                option.nextElementSibling.style.fontWeight = 'bold'
            }
        })
        questionDiv.style.boxShadow = '0 0 10px rgba(220, 53, 69, 0.5)'
    }
}

// Fonction pour récupérer l'ID de la réponse correcte à une question
async function getCorrectOptionId(questionId) {
    const correctOption = await fetchCorrectAnswer(questionId);
    return correctOption.optionId;
}

// Fonction pour récupérer la réponse correcte à une question depuis l'API
async function fetchCorrectAnswer(questionId) {
    const response = await fetch(`http://localhost:8080/TPRestAPIFinal_war_exploded/api/system/questions/${questionId}/rightanswer`, { method: 'GET', headers: { "Content-Type": "application/json" }});
    const correctOption = await response.json();
    return correctOption;
}

// Fonction pour vérifier si la réponse sélectionnée par l'utilisateur est correcte
async function verifyAnswer(questionId, selectedOptionId) {
    const correctOption = await fetchCorrectAnswer(questionId);
    return correctOption.optionId === parseInt(selectedOptionId) && correctOption.estVrai;
}
