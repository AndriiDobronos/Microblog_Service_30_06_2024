document.getElementById('deleteForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('id').value;

    await fetch('/pug/delete-comment/' + id, {
        method: 'DELETE'});

    window.location.href = '/pug';
})