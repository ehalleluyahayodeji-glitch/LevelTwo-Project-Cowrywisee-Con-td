
let forgotPasswordState = {
    email: '',
    pin: '',
    attempts: 0
};

function openForgotPasswordModal(event) {
    if (event) event.preventDefault();
    
    forgotPasswordState = {
        email: '',
        pin: '',
        attempts: 0
    };
    
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        document.body.style.overflow = 'hidden';
        
        showForgotStep(1);
        
        setTimeout(() => {
            document.getElementById('forgotEmail').focus();
        }, 100);
    }
}

function closeForgotPasswordModal() {
    
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    showForgotError('');
}

function showForgotStep(step) {
    document.getElementById('forgotPasswordStep1').style.display = 'none';
    document.getElementById('forgotPasswordStep2').style.display = 'none';
    document.getElementById('forgotPasswordStep3').style.display = 'none';
    document.getElementById('forgotPasswordStep4').style.display = 'none';
    document.getElementById('forgotPasswordError').style.display = 'none';
    
    if (step === 1) {
        document.getElementById('forgotPasswordStep1').style.display = 'block';
        setTimeout(() => document.getElementById('forgotEmail').focus(), 100);
    } else if (step === 2) {
        document.getElementById('forgotPasswordStep2').style.display = 'block';
        document.getElementById('forgotPin').value = '';
        setTimeout(() => document.getElementById('forgotPin').focus(), 100);
    } else if (step === 3) {
        document.getElementById('forgotPasswordStep3').style.display = 'block';
        document.getElementById('forgotNewPassword').value = '';
        document.getElementById('forgotConfirmPassword').value = '';
        setTimeout(() => document.getElementById('forgotNewPassword').focus(), 100);
    } else if (step === 4) {
        document.getElementById('forgotPasswordStep4').style.display = 'block';
    }
}

function verifyForgotEmail() {
    const email = document.getElementById('forgotEmail').value.trim();
    
    if (!email) {
        Toastify({
                text: "Please enter your email address",
                duration: 3000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #1a1a1a, #c0392b)",
                maxWidth: "100%"
        }
    }).showToast();
        return;
    }

    if (!isValidEmail(email)) {
                Toastify({
                text: "Please enter a valid email address",
                duration: 4000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #1a1a1a, #c0392b)",
                maxWidth: "100%"
        }
    }).showToast();
        return;
    }
    const users = JSON.parse(localStorage.getItem('details')) || [];
    const userExists = users.some(u => (u.user_email || u.email || '').toLowerCase() === email.toLowerCase());
    
    if (!userExists) {
                Toastify({
                text: "❌ No account found with this email address!",
                duration: 3000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #1a1a1a, #c0392b)",
                maxWidth: "100%"
        }
    }).showToast();
        return;
    }

    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    forgotPasswordState.email = email;
    forgotPasswordState.pin = pin;
    forgotPasswordState.attempts = 0;
    
    Toastify({
                text: "Email verified! PIN generated ✅",
                duration: 4000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #00b09b, #96c93d",
                maxWidth: "100%"
        }
    }).showToast();
    setTimeout(() => {
        showResetPassword.innerHTML = `<div style="background: #ffcc00; color: #fff; padding: 10px; font-size: 16px; font-weight: bold; display: block;">PIN CODE:  ${pin}</div>`;
    }, 1000);
    
    showForgotStep(2);
}

function verifyPin() {
    const enteredPin = document.getElementById('forgotPin').value.trim();
    
    if (!enteredPin) {
            Toastify({
                text: "Please enter the PIN!",
                duration: 4000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #1a1a1a, #c0392b)",
                maxWidth: "100%"
        }
    }).showToast();
        return;
    }


    if (enteredPin !== forgotPasswordState.pin) {
        forgotPasswordState.attempts++;
        
        if (forgotPasswordState.attempts >= 3) {
            Toastify({
                text: "❌ Too many incorrect attempts. Please try again.",
                duration: 4000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #1a1a1a, #c0392b)",
                maxWidth: "100%"
        }
    }).showToast();
            setTimeout(() => {
                showForgotStep(1);
            }, 2000);
            return;
        }
        
        Toastify({
                text: "❌ Incorrect PIN. Try again. (Attempt " + forgotPasswordState.attempts + "/3",
                duration: 4000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #1a1a1a, #c0392b)",
                maxWidth: "100%"
        }
    }).showToast();

        return;
    }
        Toastify({
                text: "✅ Pin verified",
                duration: 4000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #00b09b, #96c93d",
                maxWidth: "100%"
        }
    }).showToast();

    document.getElementById('showResetPassword').style.display = "none"
    showForgotStep(3);
}

function resetPassword() {
    console.log("🔄 Resetting password...");
    

    const newPassword = document.getElementById('forgotNewPassword').value;
    const confirmPassword = document.getElementById('forgotConfirmPassword').value;
    
    if (!newPassword) {
        Toastify({
                text: "Please enter a new password",
                duration: 4000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #1a1a1a, #c0392b)",
                maxWidth: "100%"
        }
    }).showToast();

        return;
    }

    if (newPassword.length < 6) {
            Toastify({
                text: "Password must be at least 6 characters",
                duration: 4000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #1a1a1a, #c0392b)",
                maxWidth: "100%"
        }
    }).showToast();
        
        return;
    }

    if (newPassword !== confirmPassword) {
            Toastify({
                text: "Passwords do not match",
                duration: 4000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #1a1a1a, #c0392b)",
                maxWidth: "100%"
        }
    }).showToast();

        return;
    }
    
    const users = JSON.parse(localStorage.getItem('details')) || [];
    const userIndex = users.findIndex(u => (u.user_email || u.email || '').toLowerCase() === forgotPasswordState.email.toLowerCase());
    
    if (userIndex === -1) {
            Toastify({
                text: "❌ Error: User account not found",
                duration: 4000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #1a1a1a, #c0392b)",
                maxWidth: "100%"
        }
    }).showToast();
        return;
    }

    users[userIndex].user_password = newPassword;
    users[userIndex].password = newPassword;
    localStorage.setItem('details', JSON.stringify(users));
            Toastify({
                text: "✅ Password updated successfully",
                duration: 4000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #00b09b, #96c93d",
                maxWidth: "100%"
        }
    }).showToast();
    console.log("📧 Email:", forgotPasswordState.email);
    
    showForgotStep(4);
    
    setTimeout(() => {
        closeForgotPasswordModal();
    }, 3000);
}


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showForgotError(message) {
    const errorDiv = document.getElementById('forgotPasswordError');
    if (!errorDiv) return;
    
    if (message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        console.warn("⚠️ " + message);
    } else {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
}

function debugForgotPassword() {
    console.log("\n=== FORGOT PASSWORD DEBUG INFO ===");
    console.log("LocalStorage available:", typeof(Storage) !== "undefined" ? "✅ Yes" : "❌ No");
    
    const users = JSON.parse(localStorage.getItem('details')) || [];
    console.log("Users in database:", "✅ " + users.length + " user(s) found");
    
    const modal = document.getElementById('forgotPasswordModal');
    console.log("Modal element:", modal ? "✅ Found" : "❌ Not found");
    
    const emailInput = document.getElementById('forgotEmail');
    console.log("Email input:", emailInput ? "✅ Found" : "❌ Not found");
    
    const pinInput = document.getElementById('forgotPin');
    console.log("PIN input:", pinInput ? "✅ Found" : "❌ Not found");
    
    const newPassInput = document.getElementById('forgotNewPassword');
    console.log("New password input:", newPassInput ? "✅ Found" : "❌ Not found");
    
    console.log("=== END DEBUG INFO ===\n");
}

document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('forgotEmail');
    if (emailInput) {
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyForgotEmail();
            }
        });
    }
    const pinInput = document.getElementById('forgotPin');
    if (pinInput) {
        pinInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyPin();
            }
        });
    }
    const confirmInput = document.getElementById('forgotConfirmPassword');
    if (confirmInput) {
        confirmInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                resetPassword();
            }
        });
    }
    
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeForgotPasswordModal();
            }
        });
    }
});



