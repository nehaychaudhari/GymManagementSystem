
// Bill And Notification
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAeqAspljLEGBBoV6u58n8h4dbK4lHryAE",
    authDomain: "gym-management-system-31.firebaseapp.com",
    databaseURL: "https://gym-management-system-31-default-rtdb.firebaseio.com",
    projectId: "gym-management-system-31",
    storageBucket: "gym-management-system-31.firebasestorage.app",
    messagingSenderId: "487007453376",
    appId: "1:487007453376:web:e728346f1beee4fc18ad25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".getnowbtn").forEach(button => {
        button.addEventListener("click", function () {
            let planName = this.getAttribute("data-plan");
            let planPrice = this.getAttribute("data-price");
            openModal(planName, planPrice);
        });
    });
});

function openModal(planName, planPrice) {
    document.getElementById('modal').style.display = 'block';
    document.getElementById('plan-name').innerText = planName;
    document.getElementById('plan-price').innerText = planPrice;
}

function submitForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const payment = document.getElementById('payment').value;
    const plan = document.getElementById('plan-name').innerText;
    const price = document.getElementById('plan-price').innerText;

    if (name && email) {
        const purchaseTime = new Date();
        const startDate = purchaseTime.toISOString().split('T')[0]; // YYYY-MM-DD format
        const endDate = new Date(purchaseTime);
        endDate.setFullYear(endDate.getFullYear() + 1); // 1 year membership
        const formattedEndDate = endDate.toISOString().split('T')[0];

        const billNumber = "BILL" + Math.floor(100000 + Math.random() * 900000); // Unique Bill Number

        const userPurchaseRef = ref(db, `purchases/${email.replace('.', '_')}/${billNumber}`);

        set(userPurchaseRef, {
            name,
            email,
            billNumber,
            paymentMethod: payment,
            purchasedPlan: plan,
            purchaseTime: purchaseTime.toLocaleString(),
            membershipDuration: {
                startDate: startDate,
                endDate: formattedEndDate
            },
            price
        }).then(() => {
            alert('Purchase Successful!');
            saveNotification(email, billNumber, plan);
            closeModal();
        }).catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('Please fill all fields.');
    }
}

function saveNotification(email, billNumber, plan) {
    const notificationsRef = ref(db, `notifications/${email.replace('.', '_')}`);
    push(notificationsRef, {
        message: `Your purchase of ${plan} is successful! Click to view bill.`,
        billNumber: billNumber,
        timestamp: Date.now()
    });
}

function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.innerHTML = '';
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    dropdown.style.marginTop = "3.5rem";
    dropdown.style.width = "300px";
    dropdown.style.height = "400px";

    const email = document.getElementById('email').value.replace('.', '_');
    const notificationsRef = ref(db, `notifications/${email}`);

    get(notificationsRef).then(snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const notificationData = child.val();
                const notification = document.createElement('button');
                notification.innerText = notificationData.message;
                notification.style.cursor = "pointer";
                notification.style.color = "#ffffff";
                notification.style.fontSize = "1.5rem";
                notification.style.backgroundColor = "transparent";
                notification.onclick = () => viewBill(email, notificationData.billNumber);
                dropdown.appendChild(notification);
                console.log(notificationData.message);
            });
        } else {
            dropdown.innerHTML = '<p>No notifications available.</p>';
        }
    });
}

function viewBill(email, billNumber) {
    const billRef = ref(db, `purchases/${email.replace('.', '_')}/${billNumber}`);

    get(billRef).then(snapshot => {
        if (snapshot.exists()) {
            const billData = snapshot.val();
            const model = document.getElementById('modal');
            model.style.display = 'block';
            model.style.width = '80%';
            model.style.height = '70%';
            document.getElementById('plan-name').innerHTML = `<strong>Bill Number:</strong> ${billData.billNumber}`;
            document.getElementById('plan-price').innerHTML = `${billData.price}`;

            document.getElementById('billing-form').innerHTML = `
                <p><strong>Name:</strong> ${billData.name}</p>
                <p><strong>Email:</strong> ${billData.email}</p>
                <p><strong>Plan:</strong> ${billData.purchasedPlan}</p>
                <p><strong>Purchase Time:</strong> ${billData.purchaseTime}</p>
                <p><strong>Membership Start Date:</strong> ${billData.membershipDuration.startDate}</p>
                <p><strong>Membership End Date:</strong> ${billData.membershipDuration.endDate}</p>
                <p><strong>Payment Method:</strong> ${billData.paymentMethod}</p>
                <button type="button" onclick="closeModal()"
                style="width: 100px; height: 3rem; margin-bottom: 1rem; padding: 10px; overflow: auto;"
                class="Purchase">Close</button>

            `;
        } else {
            alert("Bill not found.");
        }
    });
}

window.submitForm = submitForm;
window.saveNotification = saveNotification;
window.toggleNotifications = toggleNotifications;
