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

    // Encrypt Password using CryptoJS
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
// Manage Members
// Fetch and display members from Firebase
function fetchMembers() {
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "";

    db.ref("users/member/").on("value", snapshot => {
        snapshot.forEach(childSnapshot => {
            let data = childSnapshot.val();
            let emailKey = data.email.replace(/\./g, "_");

            let row = `<tr>
                <td>${data.name}</td>
                <td>${data.email}</td>
                <td>
                    <button class="editbtn" id="editbtn">Edit</button>
                    <button class="deletebtn" id="deletebtn">Delete</button>
                </td>
            </tr>`;
            memberList.innerHTML += row;

            // Edit Member Start
            const editbtn = document.querySelector(`button.editbtn`);
            editbtn.addEventListener("click", function () {
                // Validate current row data exists
                if (!data || !data.name || !data.email) {
                    alert("Error: Member data not found");
                    return;
                }

                try {
                    let newName = prompt("Enter new name:", data.name);
                    let newEmail = prompt("Enter new email:", data.email);

                    // Validate inputs
                    if (!newName || !newEmail) {
                        alert("Please enter both name and email");
                        return;
                    }

                    if (!newEmail.includes('@')) {
                        alert("Please enter a valid email address");
                        return;
                    }

                    let newEmailKey = newEmail.replace(/\./g, "_");

                    // Check if new email already exists
                    db.ref("users/member/" + newEmailKey).once('value')
                        .then((snapshot) => {
                            if (snapshot.exists() && newEmailKey !== emailKey) {
                                alert("This email is already in use");
                                return;
                            }

                            return db.ref("users/member/" + emailKey).update({
                                name: newName,
                                email: newEmail
                            });
                        })
                        .then(() => {
                            alert("Member Updated Successfully!");
                            fetchMembers();
                        })
                        .catch(error => {
                            console.error("Update error:", error);
                            alert("Error updating member: " + error.message);
                        });

                } catch (err) {
                    console.error("Edit error:", err);
                    alert("An error occurred while editing member");
                }
            });

            // Edit Member End

            // Delete Member Start
            const deletebtn = document.querySelector(`button.deletebtn`);
            deletebtn.addEventListener("click", () => {
                db.ref("users/member/" + emailKey).remove()
                    .then(() => {
                        alert("Member Deleted Successfully!");
                        fetchMembers();
                    })
                    .catch(error => {
                        alert("Error deleting member: " + error.message);
                    });
            });
            // Delete Member End

            // Set up monthly notification for new pricing
            const checkDate = new Date();
            if (checkDate.getDate() === 1) {
                db.ref("users/member/" + emailKey).once('value')
                    .then((snapshot) => {
                        const memberData = snapshot.val();
                        if (memberData && memberData.email) {
                            Email.send({
                                Host: "smtp.elasticemail.com",
                                Username: "your-email@domain.com",
                                Password: "your-smtp-password",
                                To: memberData.email,
                                From: "gym@domain.com",
                                Subject: "New Pricing Available!",
                                Body: "Dear " + memberData.name + ",\n\nNew pricing packages are now available. Please check our website for updated rates.\n\nRegards,\nGym Management"
                            }).then(() => {
                                console.log("Pricing notification sent to " + memberData.email);
                            }).catch(err => {
                                console.error("Error sending notification:", err);
                            });
                        }
                    });
            }
        });
    });
}
fetchMembers();

// Create Bill
// Update plan details when selection changes
document.getElementById('bill-planSelect').onchange = function() {
    const planSelect = document.getElementById('bill-planSelect');
    const selectedPlan = document.getElementById('bill-selected-plan');
    const planPrice = document.getElementById('bill-plan-price');

    if (planSelect.value) {
        firebase.database().ref('plans/' + planSelect.value).once('value')
            .then((snapshot) => {
                const data = snapshot.val();
                selectedPlan.textContent = planSelect.options[planSelect.selectedIndex].text;
                planPrice.textContent = data.price;
            });
    } else {
        selectedPlan.textContent = '-';
        planPrice.textContent = '-';
    }
}

// Show/hide payment method details
document.getElementById('bill-payment').addEventListener('change', function () {
    document.querySelectorAll('.payment-method').forEach(div => div.style.display = 'none');
    const selected = this.value;
    if (selected) {
        document.getElementById('bill-' + selected + (selected === 'upi' ? '-payment' : '-card')).style.display = 'block';
    }
});

// Process purchase and create bill
document.getElementById('processPurchase').addEventListener('click', function() {
    const memberName = document.getElementById('bill-member-name').value;
    const memberEmail = document.getElementById('bill-member-email').value;
    const planSelect = document.getElementById('bill-planSelect');
    const planName = planSelect.options[planSelect.selectedIndex].text;
    const planPrice = document.getElementById('bill-plan-price').textContent;
    const paymentMethod = document.getElementById('bill-payment').value;

    // Check if all fields are filled
    if (!memberName || !memberEmail || !planSelect.value || !paymentMethod) {
        alert('Please fill all fields!');
        return;
    }

    // Check if payment details are filled based on selected method
    if (paymentMethod === 'upi') {
        const upiId = document.getElementById('bill-upi-payment').querySelector('input').value;
        if (!upiId) {
            alert('Please enter UPI ID!');
            return;
        }
    } else if (paymentMethod === 'credit') {
        const creditNumber = document.getElementById('bill-credit-card').querySelector('input[placeholder="Card Number"]').value;
        const creditExpiry = document.getElementById('bill-credit-card').querySelector('input[placeholder="Expiry Date"]').value;
        const creditCvv = document.getElementById('bill-credit-card').querySelector('input[placeholder="CVV"]').value;

        if (!creditNumber || !creditExpiry || !creditCvv) {
            alert('Please fill all credit card details!');
            return;
        }
    } else if (paymentMethod === 'debit') {
        const debitNumber = document.getElementById('bill-debit-card').querySelector('input[placeholder="Card Number"]').value;
        const debitExpiry = document.getElementById('bill-debit-card').querySelector('input[placeholder="Expiry Date"]').value;
        const debitCvv = document.getElementById('bill-debit-card').querySelector('input[placeholder="CVV"]').value;

        if (!debitNumber || !debitExpiry || !debitCvv) {
            alert('Please fill all debit card details!');
            return;
        }
    }

    // Verify member exists
    const emailKey = memberEmail.replace(/\./g, '_');
    firebase.database().ref('users/member/' + emailKey).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                // Create bill
                const billRef = firebase.database().ref('bills').push();
                const billData = {
                    memberId: emailKey,
                    memberName: memberName,
                    memberEmail: memberEmail,
                    planName: planName,
                    planPrice: planPrice,
                    purchaseDate: new Date().toISOString(),
                    status: 'Paid',
                    paymentMethod: paymentMethod
                };

                billRef.set(billData).then(() => {
                    // Create notification
                    const notifRef = firebase.database().ref('notifications/' + emailKey).push();
                    notifRef.set({
                        type: 'bill',
                        message: `Your bill for ${planName} is ready. Click to view PDF.`,
                        billId: billRef.key,
                        timestamp: new Date().toISOString(),
                        read: false
                    });

                    alert('Purchase successful! Bill has been generated.');
                    document.getElementById('bill-form').reset();
                });
            } else {
                alert('Member not found! Please check email address.');
            }
        });
})

// Assign fee package
// Function to save plan price
function savePlanPrice(planId, price, planType) {
    const plansRef = db.ref('plans/' + planType);
    plansRef.set({
        price: price
    })
        .then(() => {
            alert('Price updated successfully!');
        })
        .catch((error) => {
            alert('Error updating price: ' + error.message);
        });
}

// Event listeners for all submit buttons
document.getElementById('monthlyBasic').addEventListener('click', () => {
    const price = document.getElementById('Basic').value;
    savePlanPrice('Basic', price, 'monthlyBasic');
});

document.getElementById('monthlyStandard').addEventListener('click', () => {
    const price = document.getElementById('Standard').value;
    savePlanPrice('Standard', price, 'monthlyStandard');
});

document.getElementById('monthlyPremium').addEventListener('click', () => {
    const price = document.getElementById('Premium').value;
    savePlanPrice('Premium', price, 'monthlyPremium');
});

document.getElementById('yearlyBasic').addEventListener('click', () => {
    const price = document.getElementById('BasicPlan').value;
    savePlanPrice('BasicPlan', price, 'yearlyBasic');
});

document.getElementById('yearlyStandard').addEventListener('click', () => {
    const price = document.getElementById('StandardPlan').value;
    savePlanPrice('StandardPlan', price, 'yearlyStandard');
});

document.getElementById('yearlyPremium').addEventListener('click', () => {
    const price = document.getElementById('PremiumPlan').value;
    savePlanPrice('PremiumPlan', price, 'yearlyPremium');
});

document.getElementById('PersonalTraining').addEventListener('click', () => {
    const price = document.getElementById('PersonalTrainingPlan').value;
    savePlanPrice('PersonalTraining', price, 'personalTraining');
});

document.getElementById('nutrition').addEventListener('click', () => {
    const price = document.getElementById('nutritionPlan').value;
    savePlanPrice('Nutrition', price, 'nutrition');
});

document.getElementById('onlineClass').addEventListener('click', () => {
    const price = document.getElementById('onlineClassPlan').value;
    savePlanPrice('OnlineClass', price, 'onlineClass');
});

// Supplement Store
// Add Product Button
document.getElementById('addProductbtn').addEventListener('click', async () => {
    try {
        const productKey = document.getElementById('productKey').value;
        const productImage = document.getElementById('productImage').files[0];
        const productName = document.getElementById('productName').value;
        const productDetails = document.getElementById('productDetails').value;
        const productPrice = document.getElementById('productPrice').value;

        // Validation check
        if (!productKey || !productImage || !productName || !productDetails || !productPrice) {
            alert('Please fill all fields!');
            return;
        }

        // Check if product key already exists using key directly
        const existingProduct = await db.ref('products/' + productKey).once('value');
        if (existingProduct.exists()) {
            alert('This product key is already in use. Please use a different key.');
            return;
        }

        const base64Image = await convertToBase64(productImage);

        const productData = {
            productKey: productKey,
            image: base64Image,
            name: productName,
            details: productDetails,
            price: productPrice,
            createdAt: new Date().toISOString()
        };

        await db.ref('products/' + productKey).set(productData);
        alert('Product added successfully!');

        // Clear form fields manually
        document.getElementById('productKey').value = '';
        document.getElementById('productImage').value = '';
        document.getElementById('productName').value = '';
        document.getElementById('productDetails').value = '';
        document.getElementById('productPrice').value = '';

    } catch (error) {
        console.error('Error:', error);
        alert('Error adding product. Please try again.');
    }
});

// Get Product Button 
document.getElementById('getProductbtn').addEventListener('click', async () => {
    try {
        const productKey = document.getElementById('productKey').value;

        if (!productKey) {
            alert('Please enter a product key!');
            return;
        }

        const snapshot = await db.ref('products/' + productKey).once('value');
        const productData = snapshot.val();

        if (productData) {
            document.getElementById('productName').value = productData.name;
            document.getElementById('productDetails').value = productData.details;
            document.getElementById('productPrice').value = productData.price;
        } else {
            alert('Product not found!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching product details!');
    }
});

// Edit Product Button
document.getElementById('editProductbtn').addEventListener('click', async () => {
    try {
        const productKey = document.getElementById('productKey').value;
        const productImage = document.getElementById('productImage').files[0];
        const productName = document.getElementById('productName').value;
        const productDetails = document.getElementById('productDetails').value;
        const productPrice = document.getElementById('productPrice').value;

        if (!productKey) {
            alert('Please enter a product key!');
            return;
        }

        let updateData = {
            name: productName,
            details: productDetails,
            price: productPrice,
            updatedAt: new Date().toISOString()
        };

        if (productImage) {
            updateData.image = await convertToBase64(productImage);
        }

        await db.ref('products/' + productKey).update(updateData);
        alert('Product updated successfully!');

        // Clear form fields manually
        document.getElementById('productKey').value = '';
        document.getElementById('productImage').value = '';
        document.getElementById('productName').value = '';
        document.getElementById('productDetails').value = '';
        document.getElementById('productPrice').value = '';

    } catch (error) {
        console.error('Error:', error);
        alert('Error updating product!');
    }
});

// Delete Product Button
document.getElementById('deleteProductbtn').addEventListener('click', async () => {
    try {
        const productKey = document.getElementById('productKey').value;

        if (!productKey) {
            alert('Please enter a product key!');
            return;
        }

        const confirmDelete = confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
            await db.ref('products/' + productKey).remove();
            alert('Product deleted successfully!');

            // Clear form fields manually
            document.getElementById('productKey').value = '';
            document.getElementById('productImage').value = '';
            document.getElementById('productName').value = '';
            document.getElementById('productDetails').value = '';
            document.getElementById('productPrice').value = '';
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting product!');
    }
});

// Helper function to convert image to base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Diet Plans
// Get references to elements
const vegTextarea = document.getElementById('veg-diet');
const nonVegTextarea = document.getElementById('non-veg-diet');

// Add Diet Plans
document.getElementById('add-veg-btn').addEventListener('click', () => {
    const vegDiet = vegTextarea.value.trim();
    if (vegDiet) {
        firebase.database().ref('Diet/veg').set({
            diet: vegDiet
        }).then(() => {
            alert('Vegetarian diet plan added successfully!');
        }).catch(error => {
            alert('Error: ' + error.message);
        });
    }
});

document.getElementById('add-nonveg-btn').addEventListener('click', () => {
    const nonVegDiet = nonVegTextarea.value.trim();
    if (nonVegDiet) {
        firebase.database().ref('Diet/nonveg').set({
            diet: nonVegDiet
        }).then(() => {
            alert('Non-vegetarian diet plan added successfully!');
        }).catch(error => {
            alert('Error: ' + error.message);
        });
    }
});

// Retrieve Diet Plans
firebase.database().ref('Diet/veg').on('value', (snapshot) => {
    if (snapshot.exists()) {
        vegTextarea.value = snapshot.val().diet;
    }
});

firebase.database().ref('Diet/nonveg').on('value', (snapshot) => {
    if (snapshot.exists()) {
        nonVegTextarea.value = snapshot.val().diet;
    }
});

// Update Diet Plans
document.getElementById('update-veg-btn').addEventListener('click', () => {
    const vegDiet = vegTextarea.value.trim();
    if (vegDiet) {
        firebase.database().ref('Diet/veg').update({
            diet: vegDiet
        }).then(() => {
            alert('Vegetarian diet plan updated successfully!');
        }).catch(error => {
            alert('Error: ' + error.message);
        });
    }
});

document.getElementById('update-nonveg-btn').addEventListener('click', () => {
    const nonVegDiet = nonVegTextarea.value.trim();
    if (nonVegDiet) {
        firebase.database().ref('Diet/nonveg').update({
            diet: nonVegDiet
        }).then(() => {
            alert('Non-vegetarian diet plan updated successfully!');
        }).catch(error => {
            alert('Error: ' + error.message);
        });
    }
});

// Delete Diet Plans
document.getElementById('delete-veg-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete vegetarian diet plan?')) {
        firebase.database().ref('Diet/veg').remove()
            .then(() => {
                alert('Vegetarian diet plan deleted successfully!');
                vegTextarea.value = '';
            }).catch(error => {
                alert('Error: ' + error.message);
            });
    }
});

document.getElementById('delete-nonveg-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete non-vegetarian diet plan?')) {
        firebase.database().ref('Diet/nonveg').remove()
            .then(() => {
                alert('Non-vegetarian diet plan deleted successfully!');
                nonVegTextarea.value = '';
            }).catch(error => {
                alert('Error: ' + error.message);
            });
    }
});
