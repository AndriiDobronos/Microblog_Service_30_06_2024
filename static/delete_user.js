document.getElementById('deleteForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userId = document.getElementById('userId').value;

    await fetch('/' + userId, {
        method: 'DELETE'});

    window.location.href = '/';
})