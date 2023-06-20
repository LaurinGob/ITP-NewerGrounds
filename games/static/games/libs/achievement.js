function unlock_achievement(id){
    const xhr = new XMLHttpRequest;
    // Initialize request
    xhr.open("GET", `/api/unlock/${id}`, true)
    // Send request
    xhr.send()
}