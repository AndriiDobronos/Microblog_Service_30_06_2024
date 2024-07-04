document.getElementById('deleteForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userId = document.getElementById('userId').value;

    await fetch('/delete-user/' + userId, {
        method: 'DELETE'});

    window.location.href = '/users-list';
})