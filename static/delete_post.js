document.getElementById('deleteForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('id').value;
    const commentIdProbably = document.getElementById('commentId').value;
    //const commentIdProbably = (locals.commentsList.filter((el)=>el.refers_to_post === locals.id)).join('*') || ""
    if(commentIdProbably) {
        const commentId = '*' + commentIdProbably
        await fetch('/delete-post/' + id + commentId, {
            method: 'DELETE'});
    }else {
        await fetch('/delete-post/' + id , {
            method: 'DELETE'});
    }

    window.location.href = '/';
})