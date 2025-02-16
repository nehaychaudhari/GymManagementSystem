// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAeqAspljLEGBBoV6u58n8h4dbK4lHryAE",
    authDomain: "gym-management-system-31.firebaseapp.com",
    databaseURL: "https://gym-management-system-31-default-rtdb.firebaseio.com",
    projectId: "gym-management-system-31",
    storageBucket: "gym-management-system-31.firebasestorage.app",
    messagingSenderId: "487007453376",
    appId: "1:487007453376:web:e728346f1beee4fc18ad25"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database
var database = firebase.database();

// Get a reference to the form and button
var Form = document.getElementById("AddMember");
var AddBtn = document.getElementById("addbtn");

// Add an event listener to the button
AddBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Get the name, email, password, confirm password, and role from the form
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();
    var confirmPassword = document.getElementById("confirm-password").value.trim();
    var role = document.getElementById("role").value.trim();

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
        alert("Password and Confirm Password do not match");
        return;
    }

    // 🔐 Encrypt Password using CryptoJS
    var encryptedPassword = CryptoJS.AES.encrypt(password, "secret-key").toString();

    // Email as Key (replace "." with "_")
    var emailKey = email.replace(/\./g, "_");

    // Check if the email is already in use
    database.ref('users/member/' + emailKey).once('value', function (snapshot) {
        if (snapshot.exists()) {
            alert("Email is already in use");
            return;
        } else {
            // Create a new user in the Firebase Realtime Database
            database.ref('users/member/' + emailKey).set({
                name: name,
                email: email,
                password: encryptedPassword,
                role: role,
            });

            alert("Member Added Successfully!!!");
        }
    });
});


const db = firebase.database();
// Fetch and display members from Firebase
function fetchMembers() {
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "";

    db.ref("users/member/").on("value", snapshot => {
        snapshot.forEach(childSnapshot => {
            let data = childSnapshot.val();
            let memberId = childSnapshot.key;

            let row = `<tr>
                <td>${data.name}</td>
                <td>${data.email}</td>
                <td>
                <button class="sendbtn" style="color: #000000;" onclick="alert('Notification Send Successfully!!')">Send Notification</button>
                    <button class="editbtn" onclick="alert('Details Updated Successfully')">Edit</button>
                    <button class="deletebtn"  onclick="alert('Member Deteted Successfully')">Delete</button>
                </td>
                </tr>`;
            memberList.innerHTML += row;
            // console.log(memberId);
        });
    });
}

// Send email notification
// function sendNotification(email) {
// Email.send({
//     SecureToken: "YOUR_SMTP_TOKEN",
//     To: email,
//     From: "contact@gymManagement.com",
//     Subject: "Membership Plan Information",
//     Body: "Dear Member, here is your membership plan details for this month. Thank you!"
// }).then(
//     message => alert("Email sent successfully!")
// );
// }
// function sendNotification() {
//     alert("Notification Send Successfully");
// }

// Open edit modal
// let currentEditId = "";
// function editMember(id, name, email) {
//     currentEditId = id;
//     document.getElementById("editName").value = name;
//     document.getElementById("editEmail").value = email;
//     document.getElementById("editModal").style.display = "block";
// }

// Update member details
// function updateMember() {
//     let newName = document.getElementById("editName").value;
//     let newEmail = document.getElementById("editEmail").value;

//     if (currentEditId) {
//         db.ref("users/member/" + currentEditId).update({
//             name: newName,
//             email: newEmail
//         }).then(() => {
//             alert("Data updated successfully!");
//             closeModal();
//             fetchMembers();
//         });
//     }
// }

// Close modal
// function closeModal() {
//     document.getElementById("editModal").style.display = "none";
// }

// Confirm delete member
// function confirmDelete(id) {
//     if (confirm("Are you sure you want to delete this member?")) {
//         deleteMember(id);
//     }
// }

// // Delete member from Firebase
// function deleteMember(memberId) {
//     db.ref("users/member/" + memberId).remove().then(() => {
//         alert("Member deleted successfully!");
//     });
// }

// // Fetch members on page load
fetchMembers();