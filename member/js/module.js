// Import Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAeqAspljLEGBBoV6u58n8h4dbK4lHryAE",
    authDomain: "gym-management-system-31.firebaseapp.com",
    databaseURL: "https://gym-management-system-31-default-rtdb.firebaseio.com",
    projectId: "gym-management-system-31",
    storageBucket: "gym-management-system-31.appspot.com",
    messagingSenderId: "487007453376",
    appId: "1:487007453376:web:e728346f1beee4fc18ad25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Global Level Variables Declaration
let memberEmail = '';
let billNumber = '';

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".getnowbtn").forEach(button => {
        button.addEventListener("click", function () {
            let planName = this.parentElement.querySelector('h3').innerText;
            let planPrice = this.parentElement.querySelector('.detail span').innerText;
            openModal(planName, planPrice);
        });
    });

    document.getElementById('bill-payment').addEventListener('change', function () {
        let paymentMethod = this.value;
        let paymentSections = {
            credit: document.getElementById('bill-credit-card'),
            debit: document.getElementById('bill-debit-card'),
            upi: document.getElementById('bill-upi-payment')
        };

        // Hide all sections first
        Object.values(paymentSections).forEach(section => section.style.display = 'none');

        // Show the selected section
        if (paymentSections[paymentMethod]) {
            paymentSections[paymentMethod].style.display = 'block';
        }
    });
});
function openModal(planName, planPrice) {
    document.getElementById('modal').style.display = 'block';
    document.getElementById('bill-selected-plan').innerText = planName;
    document.getElementById('bill-plan-price').innerText = planPrice;
}

document.getElementById('processPurchase').addEventListener('click', () => {
    const memberName = document.getElementById('bill-member-name').value;
    memberEmail = document.getElementById('bill-member-email').value.replace('.', '_');
    const paymentMethod = document.getElementById('bill-payment').value;
    const plan = document.getElementById('bill-selected-plan').innerText;
    const price = document.getElementById('bill-plan-price').innerText;
    
    // Payment Method
    if (!memberName || !memberEmail || !paymentMethod) {
        alert('Please fill all fields!');
        return;
    }
    let paymentDetails = {};
    if (paymentMethod === 'credit') {
        const cardNumber = document.getElementById('bill-credit-card-number').value;
        const expiryDate = document.getElementById('bill-credit-card-expiry').value;
        const cvv = document.getElementById('bill-credit-card-cvv').value;

        if (!cardNumber || !expiryDate || !cvv) {
            alert('Please fill all credit card fields!');
            return;
        }
        paymentDetails = { cardNumber, expiryDate, cvv };
    } else if (paymentMethod === 'debit') {
        const debitNumber = document.getElementById('bill-debit-card-number').value;
        const debitExpiry = document.getElementById('bill-debit-card-expiry').value;
        const debitCvv = document.getElementById('bill-debit-card-cvv').value;

        if (!debitNumber || !debitExpiry || !debitCvv) {
            alert('Please fill all debit card fields!');
            return;
        }
        paymentDetails = { debitNumber, debitExpiry, debitCvv };
    } else if (paymentMethod === 'upi') {
        const upiId = document.getElementById('bill-upi-id').value;

        if (!upiId) {
            alert('Please enter UPI ID!');
            return;
        }
        paymentDetails = { upiId };
    }

    billNumber = Math.floor(10000 + Math.random() * 90000).toString();
    const purchaseData = {
        memberName, memberEmail, paymentMethod, paymentDetails, billNumber, plan, price, timestamp: new Date().toISOString()
    };
    const purchaseRef = ref(db, `purchases/${memberEmail}/${billNumber}`);
    
    // Store Purchase Data
    set(purchaseRef, purchaseData)
        .then(() => {
            const notificationRef = ref(db, `notifications/${memberEmail}/${billNumber}`);
            set(notificationRef, {
                type: 'bill', message: `Your bill number ${billNumber} has been created.`,
                billId: billNumber, timestamp: new Date().toISOString(), read: true
            });
            alert('Purchase successful!');
            document.getElementById('bill-member-name').value = '';
            document.getElementById('bill-member-email').value = '';
            closeModal();
        })
        .catch(error => alert('Error saving purchase: ' + error.message));
});

// Notification Dropdown
document.getElementById('bell').addEventListener('click', () => {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    dropdown.style.marginTop = "3.5rem";
    dropdown.style.width = "300px";
    dropdown.style.height = "400px";
    get(ref(db, `notifications/${memberEmail}/`)).then(snapshot => {
        if (snapshot.exists()) {
            dropdown.innerHTML = '';
            snapshot.forEach(child => {
                let notificationData = child.val();
                if (notificationData.message) {
                    let notification = document.createElement('button');
                    notification.innerText = notificationData.message;
                    notification.style.cursor = "pointer";
                    notification.style.backgroundColor = "transparent";
                    notification.style.border = "none";
                    notification.style.color = "white";
                    notification.style.textAlign = "left";
                    notification.style.padding = "10px";
                    notification.style.fontSize = "16px";

                    notification.onclick = () => viewBill(memberEmail, notificationData.billId);
                    dropdown.appendChild(notification);
                } else {
                    dropdown.innerHTML = '<p style="color: white;">You can view your bill only once. Make sure to save it for your records.</p>';
                }
            });
        } else {
            dropdown.innerHTML = '<p style="color: white;">No notifications available.</p>';
        }
    });
});

// View Bill
function viewBill(email, billId) {
    get(ref(db, `purchases/${email}/${billId}`)).then(snapshot => {
        if (snapshot.exists()) {
            let billData = snapshot.val();
            document.getElementById('modal').style.display = 'block';
            document.getElementById('billing-form').innerHTML = `
                <p><strong>Bill Number:</strong> ${billData.billNumber}</p>
                <p><strong>Name:</strong> ${billData.memberName}</p>
                <p><strong>Email:</strong> ${billData.memberEmail}</p>
                <p><strong>Plan:</strong> ${billData.plan}</p>
                <p><strong>Price:</strong> ${billData.price}</p>
                <p><strong>Payment Method:</strong> ${billData.paymentMethod}</p>
                <button type="button" style="background-color: red; color: white; border: none; padding: 10px; cursor: pointer;" onclick="closeModal()">Close</button>
                <button type="button" style="background-color: green; color: white; border: none; padding: 10px; cursor: pointer;" onclick="printBill()">Print</button>
            `;
        } else {
            alert("Bill not found.");
        }
    });
}

// Monthly Plans function to display prices
function displayPrices() {
    const plans = ['monthlyBasic', 'monthlyStandard', 'monthlyPremium', 'yearlyBasic', 'yearlyStandard', 'yearlyPremium', 'personalTraining', 'nutrition', 'onlineClass']; // List of plans
    plans.forEach(plan => {
        // Fetch price for each plan from the database
        get(ref(db, `plans/${plan}`)).then((snapshot) => {
            const price = snapshot.val().price; // Get price from snapshot
            document.getElementById(`${plan}Price`).textContent = price; // Display price
            
            // If the plan is yearly, calculate and display savings
            if (plan.startsWith('yearly')) {
                document.getElementById(`${plan}Savings`).textContent = (price * 0.2).toFixed(0); // Calculate savings
            }
        });
    });
}

document.getElementById('StartTrial').addEventListener('click', function() {
    // Set session start time
    const sessionStart = new Date().getTime();
    const sessionDuration = 72 * 60 * 60 * 1000;

    // Store session start time in localStorage
    localStorage.setItem('sessionStart', sessionStart);

    // Notify user that trial has started
    alert("Your trial period has commenced successfully!!!");

    // Disable the StartTrial button
    this.disabled = true;

    // Check if session has ended after 72 hours
    setTimeout(() => {
        const currentTime = new Date().getTime();
        if (currentTime - sessionStart >= sessionDuration) {
            alert("Your trial session has ended.");
        }
    }, sessionDuration);
});


// Call the function when page loads to display prices
displayPrices();
