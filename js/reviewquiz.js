// Fonction pour charger les quiz non utilisés
async function loadUsedQuizzes() {
    const response = await fetch('http://localhost:8080/TPRestAPIFinal_war_exploded/api/system/usedquizzes', { method: 'GET', headers: { "Content-Type": "application/json" } })
    const usedQuizzes = await response.json();
    return usedQuizzes
}

// Appel de la fonction pour récupérer les quizzes et les afficher
loadUsedQuizzes().then(usedQuizzes => {
    console.log(usedQuizzes)
    let quizSelect = document.getElementById('listUsedQuizzes')
    if (quizSelect != null) {
        usedQuizzes.forEach(quiz => {
            listUsedQuizzes.innerHTML += `
                <a href="answerstoquiz.html?id=${quiz.quizId}" class="list-group-item list-group-item-action">${quiz.titre}</a> 
            `       
        })
    }    
})