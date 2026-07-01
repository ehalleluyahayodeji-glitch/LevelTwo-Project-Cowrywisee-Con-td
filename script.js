// // SIGN UP JS
const userData = JSON.parse(localStorage.getItem('details')) || []
const clickEmail = document.getElementById('continueBtn')
clickEmail.addEventListener('click', ()=>{
    const email = document.getElementById('getUserEmail').value
    const firstName = document.getElementById('getUserFirstName').value
    const lastName = document.getElementById('getUserLastName').value
    const userName = document.getElementById('getUserUsername').value
    const phoneNumber = document.getElementById('getUserPhone').value
    const password = document.getElementById('getUserPassword').value
    const confirmPassword = document.getElementById('getUserConfirmPassword').value 
    if (email === ""){
        // setTimeout(() => {
        //     showEmail.style.display = "block"
        // }, 1500);
        alert('Please Kindly fill in your Email Address')
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
            user_confirm_password: confirmPassword
        }
        userData.push(savedUserData)
        localStorage.details = JSON.stringify(userData)
        console.log(userData);
//         Toastify({
//             text: "Sign Up Successful",
//             className: "info",
//             style: {
//                 background: "linear-gradient(to right, #00b09b, #96c93d)",
// }
// }).showToast();
alert('Signup Successful')
        setTimeout(() => {
            window.location.href = "Login.html"
            
        }, 1500);
    }
})

function loginUser (){
    const userData = JSON.parse(localStorage.getItem('details')) || []
    const enterEmail = document.getElementById('getEmail').value
    const enterPassword = document.getElementById('getPassword').value
    if (enterEmail === "" && enterPassword === "") {
        // alert('Kindly fill up this field')
        document.getElementById('pinModal').style.display = 'flex'
    } else if(userData.find(user => user.user_email === enterEmail && user.user_password === enterPassword)){
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
        console.log(savedPin)
        localStorage.setItem('pinSet', JSON.stringify(savedPin))
        alert('pin set successfully')
        setTimeout(() => {
            document.getElementById('pinModal').style.display = 'none'
        }, 1500);
    }
    
}



// function showToastMessage(msg){
//     const toaster = document.getElementById('toastMsg')
//     toaster.textContent = msg
//     toaster.classList.add("light");
//     setTimeout(() => {
//         toaster.classList.remove("light");
//     }, 3000);
// }

function getCurrentUser(){
    const userData = JSON.parse(localStorage.getItem('details')) || [];
    return userData.length ? userData[userData.length - 1] : null;
}

function updateDashboard(){
    const user = getCurrentUser();
    const greeting = document.getElementById('dashboardGreeting');
    const balanceField = document.getElementById('balanceAmount');
    const savedState = JSON.parse(localStorage.getItem('dashboardState')) || { balance: 0, hidden: false };

    if(greeting && user){
        greeting.textContent = `Howdy, ${user.user_first_name || user.user_name || 'Investor'}`;
    }

    if(balanceField){
        balanceField.textContent = savedState.hidden ? '₦••••••••' : `₦${savedState.balance.toLocaleString('en-NG', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    }
}

function saveDashboardState(state){
    const currentState = JSON.parse(localStorage.getItem('dashboardState')) || { balance: 0, hidden: false };
    localStorage.setItem('dashboardState', JSON.stringify({ ...currentState, ...state }));
    updateDashboard();
}

function toggleBalance(){
    const currentState = JSON.parse(localStorage.getItem('dashboardState')) || { balance: 0, hidden: false };
    saveDashboardState({ hidden: !currentState.hidden });
}

function addCash(amount){
    const currentState = JSON.parse(localStorage.getItem('dashboardState')) || { balance: 0, hidden: false };
    saveDashboardState({ balance: currentState.balance + amount });
    showActionToast(`Added ₦${amount.toLocaleString('en-NG')} to your balance`);
}

function addCashInput(){
    const amount = prompt('Enter amount to add (numbers only):');
    const numeric = Number(amount?.replace(/[^0-9]/g, ''));
    if(numeric && numeric > 0){
        addCash(numeric);
    } else {
        showActionToast('Invalid amount entered');
    }
}

function createGoal(){
    showActionToast('Goal creation is not available yet. Use this space to plan your savings.');
}

function logout(){
    window.location.href = 'Login.html';
}

function showActionToast(message){
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.background = 'rgba(4, 63, 190, 0.95)';
    toast.style.color = 'white';
    toast.style.padding = '14px 18px';
    toast.style.borderRadius = '18px';
    toast.style.boxShadow = '0 14px 50px rgba(4, 63, 190, 0.24)';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '14px';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}

window.addEventListener('DOMContentLoaded', updateDashboard);

