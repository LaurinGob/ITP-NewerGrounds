function unlock_achievement(id){
    const xhr = new XMLHttpRequest;

    // Determine what should be done with the response; the response contains
    // information about the achievement
    xhr.onreadystatechange = () => {
        if(xhr.status == 200 && xhr.readyState == 4){
            const achievement = JSON.parse(xhr.responseText);
            alert(`Achievement unlocked!\n${achievement.title} - ${achievement.description}`)
        }
    }

    // Initialize request
    xhr.open("GET", `/api/unlock/${id}`, true);
    // Send request
    xhr.send();
}