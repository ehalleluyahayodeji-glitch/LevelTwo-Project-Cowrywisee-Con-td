// // SIGN UP JS
const userData = JSON.parse(localStorage.getItem('details')) || []

function normalizeUser(user = {}) {
    const email = user.user_email || user.email || '';
    return {
        email,
        fname: user.user_first_name || user.fname || '',
        lname: user.user_last_name || user.lname || '',
        username: user.user_name || user.username || '',
        phone: user.user_phone_number || user.phone || '',
        password: user.user_password || user.password || '',
        balance: user.balance || '1000.00',
        pin: user.pin || '0000'
    };
}

function syncUserSession(user = {}) {
    const profile = normalizeUser(user);
    if (!profile.email) return null;

    localStorage.setItem('currentUser', profile.email);
    localStorage.setItem(profile.email, JSON.stringify(profile));

    const allUsers = JSON.parse(localStorage.getItem('details') || '[]');
    const existingIndex = allUsers.findIndex((entry) => (entry.user_email || entry.email) === profile.email);

    if (existingIndex >= 0) {
        allUsers[existingIndex] = {
            ...allUsers[existingIndex],
            ...profile,
            user_email: profile.email,
            user_first_name: profile.fname,
            user_last_name: profile.lname,
            user_name: profile.username,
            user_phone_number: profile.phone,
            user_password: profile.password
        };
    } else {
        allUsers.push({
            ...profile,
            user_email: profile.email,
            user_first_name: profile.fname,
            user_last_name: profile.lname,
            user_name: profile.username,
            user_phone_number: profile.phone,
            user_password: profile.password
        });
    }

    localStorage.setItem('details', JSON.stringify(allUsers));
    const usernameList = allUsers
        .map((entry) => (entry.user_name || entry.username || '').trim())
        .filter(Boolean);
    localStorage.setItem('usernameList', JSON.stringify(usernameList));

    return profile;
}

const clickEmail = document.getElementById('continueBtn')
if (clickEmail) {
    clickEmail.addEventListener('click', ()=>{
        const email = document.getElementById('getUserEmail').value
        const firstName = document.getElementById('getUserFirstName').value
        const lastName = document.getElementById('getUserLastName').value
        const userName = document.getElementById('getUserUsername').value
        const phoneNumber = document.getElementById('getUserPhone').value
        const password = document.getElementById('getUserPassword').value
        const confirmPassword = document.getElementById('getUserConfirmPassword').value
        if (email === ""){
                Toastify({
                    text: 'Please Kindly fill in all the input!',
                    className: 'info',
                    duration: 4000,
                    style: { background: 'linear-gradient(to right, #1a1a1a, #c0392b)', maxWidth: '100%' }
                }).showToast();
        } else if(firstName === "" || lastName === "" || userName === "" || phoneNumber === "" || password === "" || confirmPassword === "" ){
            alert('Please fill all the input fields!!')
        } else if(password !== confirmPassword){
            alert('Password do not match!!!')
        } else{
            const savedUserData = {
                user_email: email,
                user_first_name: firstName,
                user_last_name: lastName,
                user_name: userName,
                user_phone_number: phoneNumber,
                user_password: password,
                user_confirm_password: confirmPassword,
                balance: '1000.00',
                pin: '0000'
            }
            userData.push(savedUserData)
            localStorage.setItem('details', JSON.stringify(userData))
            syncUserSession(savedUserData)
            console.log(userData);
            Toastify({
                text: "SignUp Successful!",
                duration: 4000,
                className: "info",
                style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                maxWidth: "100%"
        }
    }).showToast();

            setTimeout(() => {
                window.location.href = "Login.html"

            }, 2500);
        }
    })
}

function loginUser (){
    const allUsers = JSON.parse(localStorage.getItem('details')) || []
    const enterEmail = document.getElementById('getEmail').value
    const enterPassword = document.getElementById('getPassword').value
    const matchedUser = allUsers.find(user => (user.user_email || user.email) === enterEmail && (user.user_password || user.password) === enterPassword)

    if (enterEmail === "" && enterPassword === "") {
        document.getElementById('pinModal').style.display = 'flex'
    } else if(matchedUser){
        syncUserSession(matchedUser)
        Toastify({
            text: "Login Successful",
            className: "info",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
}
}).showToast();

    setTimeout(() => {
        window.location.href = 'dashboard.html'
    }, 1500);
    }else{
        alert('Invalid email or password. Please try again.')
    }
}

function attachPinInputBehavior() {
    const pinInputs = document.querySelectorAll('.pin-input');
    if (!pinInputs.length) return;

    pinInputs.forEach((input, index) => {
        input.addEventListener('input', (event) => {
            const value = event.target.value.replace(/\D/g, '').slice(0, 1);
            event.target.value = value;

            if (value && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace' && !event.target.value && index > 0) {
                pinInputs[index - 1].focus();
                pinInputs[index - 1].value = '';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', attachPinInputBehavior);

function createPin (){
    const pin_one = document.getElementById('pinOne').value
    const pin_two = document.getElementById('pinTwo').value
    const pin_three = document.getElementById('pinThree').value
    const pin_four = document.getElementById('pinFour').value
    const new_pin_one = document.getElementById('newPinOne').value
    const new_pin_two = document.getElementById('newPinTwo').value
    const new_pin_three = document.getElementById('newPinThree').value
    const new_pin_four = document.getElementById('newPinFour').value

    if (pin_one === "" && pin_two === "" && pin_three === "" && pin_four === "" && new_pin_one === "" && new_pin_two === "" && new_pin_three === "" && new_pin_four === ""){
        alert('Please Kindly fill in the field!')
    } else if(pin_one !== new_pin_one || pin_two !== new_pin_two || pin_three !== new_pin_three || pin_four !== new_pin_four){
        alert("password do not match")
    } else {
        const savedPin = {pin_one, pin_two, pin_three, pin_four, new_pin_one, new_pin_two, new_pin_three, new_pin_four}
        const pinValue = `${pin_one}${pin_two}${pin_three}${pin_four}`
        console.log(savedPin)
        localStorage.setItem('pinSet', JSON.stringify(savedPin))

        const currentUserEmail = localStorage.getItem('currentUser');
        if (currentUserEmail) {
            const currentUserInfo = JSON.parse(localStorage.getItem(currentUserEmail) || '{}');
            currentUserInfo.pin = pinValue;
            localStorage.setItem(currentUserEmail, JSON.stringify(currentUserInfo));

            const allUsers = JSON.parse(localStorage.getItem('details') || '[]');
            const existingIndex = allUsers.findIndex((entry) => (entry.user_email || entry.email) === currentUserEmail);
            if (existingIndex >= 0) {
                allUsers[existingIndex].pin = pinValue;
                localStorage.setItem('details', JSON.stringify(allUsers));
            }
        }

        Toastify({
            text: "Pin set Successfully",
            className: "info",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
}
}).showToast();
        setTimeout(() => {
            document.getElementById('pinModal').style.display = 'none'
        }, 3500);
    }

}




















// function getCurrentUser(){
//     const userData = JSON.parse(localStorage.getItem('details')) || [];
//     return userData.length ? userData[userData.length - 1] : null;
// }

// function updateDashboard(){
//     const user = getCurrentUser();
//     const greeting = document.getElementById('dashboardGreeting');
//     const balanceField = document.getElementById('balanceAmount');
//     const savedState = JSON.parse(localStorage.getItem('dashboardState')) || { balance: 0, hidden: false };

//     if(greeting && user){
//         greeting.textContent = `Howdy, ${user.user_first_name || user.user_name || 'Investor'}`;
//     }

//     if(balanceField){
//         balanceField.textContent = savedState.hidden ? '₦••••••••' : `₦${savedState.balance.toLocaleString('en-NG', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
//     }
// }

// function saveDashboardState(state){
//     const currentState = JSON.parse(localStorage.getItem('dashboardState')) || { balance: 0, hidden: false };
//     localStorage.setItem('dashboardState', JSON.stringify({ ...currentState, ...state }));
//     updateDashboard();
// }

// function toggleBalance(){
//     const currentState = JSON.parse(localStorage.getItem('dashboardState')) || { balance: 0, hidden: false };
//     saveDashboardState({ hidden: !currentState.hidden });
// }

// function addCash(amount){
//     const currentState = JSON.parse(localStorage.getItem('dashboardState')) || { balance: 0, hidden: false };
//     saveDashboardState({ balance: currentState.balance + amount });
//     showActionToast(`Added ₦${amount.toLocaleString('en-NG')} to your balance`);
// }

// function addCashInput(){
//     const amount = prompt('Enter amount to add (numbers only):');
//     const numeric = Number(amount?.replace(/[^0-9]/g, ''));
//     if(numeric && numeric > 0){
//         addCash(numeric);
//     } else {
//         showActionToast('Invalid amount entered');
//     }
// }

// function createGoal(){
//     showActionToast('Goal creation is not available yet. Use this space to plan your savings.');
// }

// function logout(){
//     window.location.href = 'Login.html';
// }

// function showActionToast(message){
//     const toast = document.createElement('div');
//     toast.textContent = message;
//     toast.style.position = 'fixed';
//     toast.style.bottom = '24px';
//     toast.style.right = '24px';
//     toast.style.background = 'rgba(4, 63, 190, 0.95)';
//     toast.style.color = 'white';
//     toast.style.padding = '14px 18px';
//     toast.style.borderRadius = '18px';
//     toast.style.boxShadow = '0 14px 50px rgba(4, 63, 190, 0.24)';
//     toast.style.zIndex = '9999';
//     toast.style.fontSize = '14px';
//     document.body.appendChild(toast);
//     setTimeout(() => {
//         toast.style.opacity = '0';
//         toast.style.transition = 'opacity 0.3s ease';
//         setTimeout(() => toast.remove(), 300);
//     }, 2200);
// }

// window.addEventListener('DOMContentLoaded', updateDashboard);

