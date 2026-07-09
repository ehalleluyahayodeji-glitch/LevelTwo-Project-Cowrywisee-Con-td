
let selectedOption = null;
let currentUserEmail = null;
let currentUser = null;
let timerInterval = null;
const totalSeconds = 3599; 
let timeRemaining = totalSeconds;

function showNotification(message, bgGradient = "linear-gradient(to right, #00b09b, #96c93d)") {
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            style: {
                background: bgGradient,
                borderRadius: "8px",
                maxWidth: "100%"
            }
        }).showToast();
    } else {
        console.log("Notification:", message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    currentUserEmail = localStorage.getItem('currentUser');
    if (!currentUserEmail) {
        window.location.href = "Login.html";
        return;
    }
    
    const storedUser = localStorage.getItem(currentUserEmail);
    if (!storedUser) {
        window.location.href = "Login.html";
        return;
    }
    
    currentUser = JSON.parse(storedUser);
    
    const greetingEl = document.getElementById("onboarding-greeting");
    if (greetingEl) {
        const fname = currentUser.fname || currentUser.user_first_name || "Investor";
        greetingEl.textContent = `Welcome, ${fname}!`;
    }
    
    const modalNameEl = document.getElementById("modal-detail-name");
    if (modalNameEl) {
        const fname = currentUser.fname || currentUser.user_first_name || "";
        const lname = currentUser.lname || currentUser.user_last_name || "";
        modalNameEl.textContent = `Cowrywise/${fname} ${lname}`.trim();
    }
    
    const amountInput = document.getElementById("funding-amount-input");
    if (amountInput) {
        validateAmount(100);
        amountInput.addEventListener("input", (e) => {
            let rawValue = e.target.value.replace(/\D/g, "");
            
            if (rawValue) {
                let num = parseInt(rawValue, 10);
                e.target.value = num.toLocaleString("en-US");
                validateAmount(num);
            } else {
                e.target.value = "";
                validateAmount(0);
            }
        });
    }
    
    const skipBtn = document.getElementById("skip-onboarding");
    if (skipBtn) {
        skipBtn.addEventListener("click", (e) => {
            e.preventDefault();
            bypassOnboarding();
        });
    }
});

function selectOnboardingCard(option) {
    selectedOption = option;
    
    const cardSavings = document.getElementById("card-savings");
    const cardInvestments = document.getElementById("card-investments");
    const continueBtn = document.getElementById("selection-continue-btn");
    
    if (option === 'savings') {
        cardSavings.classList.add("selected");
        cardInvestments.classList.remove("selected");
    } else {
        cardInvestments.classList.add("selected");
        cardSavings.classList.remove("selected");
    }
    
    if (continueBtn) {
        continueBtn.removeAttribute("disabled");
    }
}

function goToFundingScreen() {
    const screenSelection = document.getElementById("screen-selection");
    const screenFunding = document.getElementById("screen-funding");
    const fundingHeader = document.getElementById("funding-header");
    
    if (selectedOption === 'investments') {
        fundingHeader.textContent = "Start investing by funding your wallet";
    } else {
        fundingHeader.textContent = "Start saving by funding your wallet";
    }
    
    screenSelection.style.display = "none";
    screenFunding.style.display = "block";
}

function goToSelectionScreen() {
    const screenSelection = document.getElementById("screen-selection");
    const screenFunding = document.getElementById("screen-funding");
    
    screenFunding.style.display = "none";
    screenSelection.style.display = "block";
}

function validateAmount(num) {
    const minWarning = document.getElementById("min-warning");
    const processingFeePill = document.getElementById("processing-fee-pill");
    const fundWalletBtn = document.getElementById("fund-wallet-btn");
    
    if (num < 1000) {
        if (minWarning) minWarning.style.display = "flex";
        if (processingFeePill) processingFeePill.style.display = "none";
        if (fundWalletBtn) fundWalletBtn.setAttribute("disabled", "true");
    } else {
        if (minWarning) minWarning.style.display = "none";
        if (processingFeePill) processingFeePill.style.display = "inline-flex";
        if (fundWalletBtn) fundWalletBtn.removeAttribute("disabled");
    }
}

function openPaymentModal() {
    const modal = document.getElementById("payment-modal");
    const input = document.getElementById("funding-amount-input");
    const amountVal = parseInt(input.value.replace(/,/g, ""), 10) || 1000;
    
    const modalAmount = document.getElementById("modal-detail-amount");
    if (modalAmount) {
        modalAmount.textContent = `₦${(amountVal + 15).toLocaleString("en-US")}`;
    }
    
    modal.style.display = "flex";
    timeRemaining = totalSeconds;
    startCountdown();
}

function closePaymentModal() {
    const modal = document.getElementById("payment-modal");
    modal.style.display = "none";
    clearInterval(timerInterval);
    document.getElementById("modal-state-verifying").style.display = "none";
    document.getElementById("modal-state-success").style.display = "none";
}

function startCountdown() {
    clearInterval(timerInterval);
    
    const timerText = document.getElementById("countdown-timer");
    const progressBarFill = document.getElementById("timer-progress-fill");
    
    function tick() {
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerText.textContent = "Transfer window expired!";
            if (progressBarFill) progressBarFill.style.width = "0%";
            return;
        }
        
        timeRemaining--;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        const padMin = minutes.toString().padStart(2, "0");
        const padSec = seconds.toString().padStart(2, "0");
        
        timerText.textContent = `Complete transfer in ${padMin}:${padSec}`;

        const percent = (timeRemaining / totalSeconds) * 100;
        if (progressBarFill) {
            progressBarFill.style.width = `${percent}%`;
        }
    }
    tick();
    timerInterval = setInterval(tick, 1000);
}

function copyText(elementId, label) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let textToCopy = el.textContent;
    if (elementId === "modal-detail-amount") {
        textToCopy = textToCopy.replace("₦", "");
    }
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            showNotification(`${label} copied to clipboard!`);
        })
        .catch(err => {
            console.error("Failed to copy: ", err);
            showNotification("Failed to copy text. Please select manually.", "linear-gradient(to right, #1a1a1a, #c0392b)");
        });
}

function toggleAccordion() {
    const header = document.querySelector(".accordion-header-cw");
    const content = document.getElementById("accordion-content");
    
    header.classList.toggle("active");
    
    if (header.classList.contains("active")) {
        content.style.display = "flex";
    } else {
        content.style.display = "none";
    }
}

function simulatePaymentVerification() {
    document.getElementById("modal-state-verifying").style.display = "flex";
    
    setTimeout(() => {
        document.getElementById("modal-state-verifying").style.display = "none";
        const input = document.getElementById("funding-amount-input");
        const fundedAmt = parseInt(input.value.replace(/,/g, ""), 10) || 1000;
        if (currentUser) {
            let currentBal = parseFloat(currentUser.balance || 0);
            currentUser.balance = (currentBal + fundedAmt).toFixed(2);
            currentUser.welcomeComplete = true;
            
            if (!currentUser.transactions) {
                currentUser.transactions = [];
            }
            currentUser.transactions.unshift({
                type: "Deposit",
                amount: fundedAmt.toFixed(2),
                date: new Date().toISOString()
            });
            saveUserProfile(currentUser);
        }
        const successDesc = document.getElementById("success-description");
        if (successDesc) {
            successDesc.textContent = `₦${fundedAmt.toLocaleString("en-US")}.00 has been successfully added to your wallet. Redirecting you to your dashboard…`;
        }
        document.getElementById("modal-state-success").style.display = "flex";
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2500);
        
    }, 2000);
}

function saveUserProfile(userProfile) {
    if (!userProfile.email) return;
    
    localStorage.setItem(userProfile.email, JSON.stringify(userProfile));
    const allUsers = JSON.parse(localStorage.getItem('details') || '[]');
    const existingIdx = allUsers.findIndex(u => (u.user_email || u.email) === userProfile.email);
    
    if (existingIdx >= 0) {
        allUsers[existingIdx] = {
            ...allUsers[existingIdx],
            ...userProfile,
            user_email: userProfile.email,
            user_first_name: userProfile.fname || userProfile.user_first_name,
            user_last_name: userProfile.lname || userProfile.user_last_name,
            user_name: userProfile.username || userProfile.user_name,
            user_phone_number: userProfile.phone || userProfile.user_phone_number,
            user_password: userProfile.password || userProfile.user_password
        };
    } else {
        allUsers.push({
            ...userProfile,
            user_email: userProfile.email,
            user_first_name: userProfile.fname || userProfile.user_first_name,
            user_last_name: userProfile.lname || userProfile.user_last_name,
            user_name: userProfile.username || userProfile.user_name,
            user_phone_number: userProfile.phone || userProfile.user_phone_number,
            user_password: userProfile.password || userProfile.user_password
        });
    }
    
    localStorage.setItem('details', JSON.stringify(allUsers));
}

function bypassOnboarding() {
    if (currentUser) {
        currentUser.welcomeComplete = true;
        saveUserProfile(currentUser);
    }
    window.location.href = "dashboard.html";
}
