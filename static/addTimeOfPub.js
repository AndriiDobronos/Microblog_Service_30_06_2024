document.getElementById('postPublish').addEventListener('submit', async function(event) {
    const date = new Date()
    const input = document.getElementById('time_publication');
    input.value = date.toLocaleString()
})