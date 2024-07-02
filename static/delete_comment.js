document.getElementById('deleteForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('id').value;

    await fetch('/delete-comment/' + id, {
        method: 'DELETE'});

    window.location.href = '/';
})