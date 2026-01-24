LoadData();
async function LoadData() {
    //async await 
    //HTTP Request GET, GET1, PUT, POST, DELETE
    try {
        let res = await fetch('http://localhost:3002/posts');
        let posts = await res.json();
        let body = document.getElementById('post-body')
        body.innerHTML = "";
        for (const post of posts) {
            body.innerHTML += convertDataToHTML(post);
        }
    } catch (error) {
        console.log(error);
    }
    LoadComments();
}
function convertDataToHTML(post) {
    const isDeleted = post.isDeleted || false;
    const style = isDeleted ? 'text-decoration: line-through; opacity: 0.6;' : '';
    const deleteBtn = isDeleted ? `<button onclick='Restore(${post.id})'>Restore</button><button onclick='HardDelete(${post.id})'>Hard Delete</button>` : `<button onclick='Edit(${post.id})'>Edit</button><button onclick='Delete(${post.id})'>Delete</button><button onclick='HardDelete(${post.id})'>Hard Delete</button>`;
    return `<tr>
        <td>${post.id}</td>
        <td style="${style}">${post.title}</td>
        <td>${post.views}</td>
        <td>${deleteBtn}</td>
    </tr>`;
}
async function saveData() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let view = document.getElementById('views_txt').value;
    if (id) {
        // Update existing
        let resPUT = await fetch('http://localhost:3002/posts/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    title: title,
                    views: view
                })
        });
        if (resPUT.ok) {
            console.log("update thanh cong");
            LoadData();
        }
        return false;
    } else {
        // Create new, compute max id
        let resGET = await fetch('http://localhost:3002/posts');
        let posts = await resGET.json();
        let maxId = posts.reduce((max, p) => Math.max(max, parseInt(p.id) || 0), 0);
        let newId = String(maxId + 1);
        let resPOST = await fetch('http://localhost:3002/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    id: newId,
                    title: title,
                    views: view
                })
        });
        if (resPOST.ok) {
            console.log("create thanh cong");
            LoadData();
        }
        return false;
    }
}
async function Delete(id) {
    let res = await fetch('http://localhost:3002/posts/' + id, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isDeleted: true })
    });
    if (res.ok) {
        console.log("soft delete thanh cong");
        LoadData();
    }
}

async function HardDelete(id) {
    let res = await fetch('http://localhost:3002/posts/' + id, {
        method: "DELETE"
    });
    if (res.ok) {
        console.log("hard delete thanh cong");
        LoadData();
    }
}

async function Restore(id) {
    let res = await fetch('http://localhost:3002/posts/' + id, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isDeleted: false })
    });
    if (res.ok) {
        console.log("restore thanh cong");
        LoadData();
    }
}

async function Edit(id) {
    let res = await fetch('http://localhost:3002/posts/' + id);
    if (res.ok) {
        let post = await res.json();
        document.getElementById("id_txt").value = post.id;
        document.getElementById("title_txt").value = post.title;
        document.getElementById('views_txt').value = post.views;
    }
}

// COMMENTS FUNCTIONS
async function LoadComments() {
    try {
        let res = await fetch('http://localhost:3002/comments');
        let comments = await res.json();
        let body = document.getElementById('comment-body');
        body.innerHTML = "";
        for (const comment of comments) {
            body.innerHTML += convertCommentToHTML(comment);
        }
    } catch (error) {
        console.log(error);
    }
}

function convertCommentToHTML(comment) {
    const isDeleted = comment.isDeleted || false;
    const style = isDeleted ? 'text-decoration: line-through; opacity: 0.6;' : '';
    const actions = isDeleted ? `<button onclick='RestoreComment(${comment.id})'>Restore</button><button onclick='HardDeleteComment(${comment.id})'>Hard Delete</button>` : `<button onclick='EditComment(${comment.id})'>Edit</button><button onclick='DeleteComment(${comment.id})'>Delete</button><button onclick='HardDeleteComment(${comment.id})'>Hard Delete</button>`;
    return `<tr>
        <td>${comment.id}</td>
        <td style="${style}">${comment.text}</td>
        <td>${comment.postId}</td>
        <td>${actions}</td>
    </tr>`;
}

async function EditComment(id) {
    let res = await fetch('http://localhost:3002/comments/' + id);
    if (res.ok) {
        let comment = await res.json();
        document.getElementById("comment_id_txt").value = comment.id;
        document.getElementById("comment_text_txt").value = comment.text;
        document.getElementById('comment_postId_txt').value = comment.postId;
    }
}

async function saveCommentData() {
    let id = document.getElementById("comment_id_txt").value;
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById('comment_postId_txt').value;
    if (id) {
        // Update existing
        let resPATCH = await fetch('http://localhost:3002/comments/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                postId: postId
            })
        });
        if (resPATCH.ok) {
            console.log("update comment thanh cong");
            LoadComments();
        }
        return false;
    } else {
        // Create new, compute max id
        let resGET = await fetch('http://localhost:3002/comments');
        let comments = await resGET.json();
        let maxId = comments.reduce((max, c) => Math.max(max, parseInt(c.id) || 0), 0);
        let newId = String(maxId + 1);
        let resPOST = await fetch('http://localhost:3002/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: newId,
                text: text,
                postId: postId
            })
        });
        if (resPOST.ok) {
            console.log("create comment thanh cong");
            LoadComments();
        }
        return false;
    }
}

async function DeleteComment(id) {
    let res = await fetch('http://localhost:3002/comments/' + id, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isDeleted: true })
    });
    if (res.ok) {
        console.log("soft delete comment thanh cong");
        LoadComments();
    }
}

async function HardDeleteComment(id) {
    let res = await fetch('http://localhost:3002/comments/' + id, {
        method: "DELETE"
    });
    if (res.ok) {
        console.log("hard delete comment thanh cong");
        LoadComments();
    }
}

async function RestoreComment(id) {
    let res = await fetch('http://localhost:3002/comments/' + id, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isDeleted: false })
    });
    if (res.ok) {
        console.log("restore comment thanh cong");
        LoadComments();
    }
}
