const LOGIN_PAGE = 'Login.html';

const showToast = function(message) {
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            style: {
                background: "linear-gradient(to right, #0A336C, #2E5C9E)",
                borderRadius: "8px",
                color: "#ffffff",
                maxWidth: "100%"
            }
        }).showToast();
    } else {
        console.log("Alert:", message);
    }
};

const normalizeUserData = (user = {}) => {
    const email = user.user_email || user.email || '';
    return {
        email,
        fname: user.user_first_name || user.fname || '',
        lname: user.user_last_name || user.lname || '',
        username: user.user_name || user.username || '',
        phone: user.user_phone_number || user.phone || '',
        password: user.user_password || user.password || '',
        balance: user.balance || '1000.00',
        pin: user.pin || '0000',
        transactions: user.transactions || [],
        gender: user.gender || '',
        dob: user.dob || '',
        nextOfKin: user.nextOfKin || null,
        profileImage: user.profileImage || null
    };
};

const getCurrentUserProfile = () => {
    const currentEmail = localStorage.getItem('currentUser');
    if (currentEmail) {
        const storedProfile = JSON.parse(localStorage.getItem(currentEmail) || 'null');
        if (storedProfile) {
            return normalizeUserData(storedProfile);
        }
    }

    const savedUsers = JSON.parse(localStorage.getItem('details') || '[]');
    if (savedUsers.length) {
        const fallbackUser = savedUsers[savedUsers.length - 1];
        const normalizedUser = normalizeUserData(fallbackUser);
        if (normalizedUser.email) {
            localStorage.setItem('currentUser', normalizedUser.email);
            localStorage.setItem(normalizedUser.email, JSON.stringify(normalizedUser));
        }
        return normalizedUser;
    }

    return null;
};

const saveCurrentUserProfile = (profile) => {
    const currentUser = normalizeUserData(profile);
    if (!currentUser.email) return null;

    localStorage.setItem('currentUser', currentUser.email);
    localStorage.setItem(currentUser.email, JSON.stringify(currentUser));

    const allUsers = JSON.parse(localStorage.getItem('details') || '[]');
    const existingIndex = allUsers.findIndex((entry) => (entry.user_email || entry.email) === currentUser.email);

    if (existingIndex >= 0) {
        allUsers[existingIndex] = {
            ...allUsers[existingIndex],
            ...currentUser,
            user_email: currentUser.email,
            user_first_name: currentUser.fname,
            user_last_name: currentUser.lname,
            user_name: currentUser.username,
            user_phone_number: currentUser.phone,
            user_password: currentUser.password
        };
    } else {
        allUsers.push({
            ...currentUser,
            user_email: currentUser.email,
            user_first_name: currentUser.fname,
            user_last_name: currentUser.lname,
            user_name: currentUser.username,
            user_phone_number: currentUser.phone,
            user_password: currentUser.password
        });
    }

    localStorage.setItem('details', JSON.stringify(allUsers));

    const usernameList = allUsers
        .map((entry) => (entry.user_name || entry.username || '').trim())
        .filter(Boolean);
    localStorage.setItem('usernameList', JSON.stringify(usernameList));

    return currentUser;
};

const fetchInfo = () => {
    const uD = getCurrentUserProfile();
    if (!uD) {
        setTimeout(() => {
            window.location.href = LOGIN_PAGE;
        }, 3000);
        return;
    }
    
    // Redirect to welcome onboarding only for brand-new users
    // (no transactions, default starting balance, and flag not set)
    const isNewUser = uD.welcomeComplete !== true
        && (!uD.transactions || uD.transactions.length === 0)
        && parseFloat(uD.balance || 0) <= 1000;
    if (isNewUser) {
        window.location.href = 'welcome.html';
        return;
    }
    

    const wName = document.getElementById('welcomeName');
    const balA = document.getElementById('balAmount');
    const balD = document.getElementById('balDecimals');
    const balA2 = document.getElementById('balAmount2');
    const balD2 = document.getElementById('balDecimals2');
    const balI = document.getElementById('balInvest');
    const uName = document.getElementById('unameProfile');
    const full_Name = document.getElementById('fullName');
    const eProfile = document.getElementById('emailProfile');
    const pProfile = document.getElementById('phoneProfile');

    if (wName) wName.innerHTML = uD.lname || uD.fname || 'Investor';
    if (uName) uName.value = uD.username || '';
    if (full_Name) full_Name.innerHTML = `${uD.fname || ''} ${uD.lname || ''}`.trim() || 'Investor';
    if (eProfile) eProfile.innerHTML = uD.email || '';
    if (pProfile) pProfile.innerHTML = uD.phone ? `+234${uD.phone.slice(1)}` : '';
    
    const balance = parseFloat(uD.balance || 1000).toFixed(2);
    if (balA) balA.innerHTML = balance.slice(0, balance.indexOf('.'));
    if (balD) balD.innerHTML = balance.slice(balance.indexOf('.'));
    if (balA2) balA2.innerHTML = balance.slice(0, balance.indexOf('.'));
    if (balD2) balD2.innerHTML = balance.slice(balance.indexOf('.'));
    if (balI) balI.innerHTML = `₦ ${balance}`;

    const genderProf = document.getElementById('genderProfile');
    const dobProf = document.getElementById('dobProfile');
    const nokProf = document.getElementById('nokProfileDisplay');
    const editGender = document.getElementById('editGender');
    const editDOB = document.getElementById('editDOB');
    const profileImg = document.getElementById('profileImageDisplay');
    const navImg = document.getElementById('navAvatarImage');

    if (genderProf) genderProf.innerHTML = uD.gender || '......';
    if (dobProf) dobProf.innerHTML = uD.dob || '......';
    if (editGender && uD.gender) editGender.value = uD.gender;
    if (editDOB && uD.dob) editDOB.value = uD.dob;

    if (profileImg && uD.profileImage) profileImg.src = uD.profileImage;
    if (navImg && uD.profileImage) navImg.src = uD.profileImage;

    if (nokProf) {
        if (uD.nextOfKin) {
            nokProf.innerHTML = `${uD.nextOfKin.name} (${uD.nextOfKin.relationship})`;
        } else {
            nokProf.innerHTML = 'No Next Of Kin';
        }
    }

    renderNotifications(uD.transactions || []);


    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const dmToggle = document.getElementById('darkModeToggle');
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (dmToggle) dmToggle.checked = true;
    }

    const hr = new Date().getHours();
    const gPrefix = document.getElementById('greeting-prefix');
    if (gPrefix) {
        if (hr < 12) gPrefix.innerHTML = 'Good Morning,';
        else if (hr < 18) gPrefix.innerHTML = 'Good Afternoon,';
        else gPrefix.innerHTML = 'Good Evening,';
    }

    setTimeout(() => {
        const loader = document.getElementById('loader');
        const app = document.getElementById('app');
        if (loader) loader.style.display = 'none';
        if (app) app.style.display = 'block';
        
    
        if (uD.pin === '0000') {
            const modalElement = document.getElementById('myModalCreatePinDash');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement, {
                    backdrop: 'static',
                    keyboard: false
                });
                modal.show();
            }
        }
    }, 1000);
}

const logout = () => {
    localStorage.removeItem('currentUser');
    showToast(`Logout successfully\nProceed to Login`);
    setTimeout(() => {
        window.location.href = LOGIN_PAGE;
    }, 3000);
}

const changeUsername = () => {
    const uName = document.getElementById('unameProfile');
    const conf = confirm('Are you sure you want to change your username?')
    if (conf) {
        const desiredName = uName.value.trim();
        const allUsername = JSON.parse(localStorage.getItem('usernameList') || '[]');
        const uD = getCurrentUserProfile();

        if (!uD) {
            showToast('No active user found');
            return;
        }

        if (desiredName.charAt(0) !== '@') {
            showToast(`Input Username as @${desiredName}`)
        } else if (allUsername.some((name) => name.toLowerCase() === desiredName.toLowerCase() && name !== uD.username)) {
            showToast('Username Taken Already');
        } else {
            uD.username = desiredName;
            saveCurrentUserProfile(uD);
            showToast('Username Changed Successfully...');
        }
    }
}

    document.getElementById('openModalPhone').addEventListener('click', () => {
        const pProfile = document.getElementById('phoneProfile');
        const pNow = document.getElementById('phoneIn')
        const profile = getCurrentUserProfile();
        pNow.value = profile?.phone ? `0${profile.phone.slice(1)}` : `0${pProfile.textContent.slice(4)}`;
});

const changePhone = () => {
    const pNow = document.getElementById('phoneIn');
    const pProfile = document.getElementById('phoneProfile');

    if (pNow.value.charAt(0) !== '0' || pNow.value.length < 11) {
        showToast('Phone Number is invalid')
    } else {
        const uD = getCurrentUserProfile();
        if (!uD) return;

        uD.phone = pNow.value;
        saveCurrentUserProfile(uD);
        showToast('Phone Number Changed Successfully...');

        pProfile.innerHTML = `+234${pNow.value.slice(1)}`

        const modalElement = document.getElementById('myModal');

        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

        modal.hide();

    }
}

function isPasswordValid(password) {
    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    return regex.test(password);
}

const changePass = () => {
    const pass = document.getElementById('password');
    const Cpass = document.getElementById('Cpassword');
    const uD = getCurrentUserProfile();

    if (!uD) return;

    if (pass.value.trim() === '' || Cpass.value.trim() === '') {
        showToast('Please fill all field');
    } else if (uD.password !== pass.value.trim()) {
        showToast('Old Password does not match');
    } else if (pass.value.trim() === Cpass.value.trim()) {
        showToast(`Old Password and New Password match\nInput a different New Password`)
    } else if (isPasswordValid(Cpass.value) === false) {
        showToast(`Enter a valid password\nMust be Alphanumeric and contain at least one special character`)
    } else {
        uD.password = Cpass.value.trim();
        saveCurrentUserProfile(uD);
        showToast('Password Changed Successfully...');

        const modalElement = document.getElementById('myModalPass');

        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

        modal.hide();
    }
}

const p1 = document.getElementById('pNo1');
const p2 = document.getElementById('pNo2');
const p3 = document.getElementById('pNo3');
const p4 = document.getElementById('pNo4');

const checkPIN = () => {
    const uD = getCurrentUserProfile();
    if (!uD) return;

    const pA = `${p1.value}${p2.value}${p3.value}${p4.value}`

    if (pA.length < 4) {
        showToast('Please input your Old Pin')
        p4.focus();
    } else {
        if (pA.trim() === uD.pin) {
            p1.value = '';
            p2.value = '';
            p3.value = '';
            p4.value = '';

            setTimeout(() => {
                const modalElement = document.getElementById('myModalPinA');
                const modal2 = bootstrap.Modal.getOrCreateInstance(modalElement);
                modal2.hide();

                const modal = new bootstrap.Modal(document.getElementById('myModalPinB'));
                modal.show();
            },1000)

        } else {
            showToast('Incorrect Old PIN')
            p4.focus();
        }
    }

}


const pin1 = document.getElementById('pinNo1');
const pin2 = document.getElementById('pinNo2');
const pin3 = document.getElementById('pinNo3');
const pin4 = document.getElementById('pinNo4');

const Cpin1 = document.getElementById('CpinNo1');
const Cpin2 = document.getElementById('CpinNo2');
const Cpin3 = document.getElementById('CpinNo3');
const Cpin4 = document.getElementById('CpinNo4');

const changePIN = () => {
    const pinA = `${pin1.value}${pin2.value}${pin3.value}${pin4.value}`
    const pinB = `${Cpin1.value}${Cpin2.value}${Cpin3.value}${Cpin4.value}`

    if (pinA === "" || pinB === "" || pinA.length < 4 || pinB.length < 4) {
        showToast('Please input your Pin')
    } else if (pinA !== pinB) {
        showToast('Pin does not match')
        Cpin4.focus();
    } else {
        const uD = getCurrentUserProfile();
        if (!uD) return;

        uD.pin = pinA;
        saveCurrentUserProfile(uD);

        showToast('PIN changed successfully...');
        pin1.value = '';
        pin2.value = '';
        pin3.value = '';
        pin4.value = '';
        Cpin1.value = '';
        Cpin2.value = '';
        Cpin3.value = '';
        Cpin4.value = '';

        setTimeout(() => {
            const modalElement = document.getElementById('myModalPinB');
            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
            modal.hide();
        },500)
    }
}


const confirmCloseAccount = () => {
    const pass = document.getElementById('closeAccountPass').value;
    const uD = getCurrentUserProfile();
    
    if (!pass) {
        showToast('Please enter your account password');
        return;
    }
    
    if (pass === uD.password) {
        localStorage.removeItem('currentUser');
        showToast('Account Terminated Successfully...');
        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 3000);
    } else {
        showToast('Incorrect password, Termination cancelled...');
    }
}

const payAmt = document.getElementById('payment-amount');

const addCash = (fixedAmount) => {
    payAmt.value = `${fixedAmount}`

    const modalElement = document.getElementById('myModalAddCash');

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    modal.show();
}

const addCashBtn = () => {
    let payBal = parseFloat(payAmt.value.trim());
    if (payAmt.value.trim() === '') {
        showToast('Enter amount you want to deposit')
    } else if (payBal < 1000) {
        showToast('Minimum Deposit is ₦1,000')
    } else {
        const handler = PaystackPop.setup({
            key: 'pk_test_277a98f5e34b8a347cf8a266fc1cf5238722528a',
            email: 'testcustomer@gmail.com',
            amount: `${payAmt.value.trim()}00`, 
            currency: 'NGN',

            callback: function (response) {
                const uD = getCurrentUserProfile();
                if (!uD) return;

                let currentBal = parseFloat(uD.balance || 0);

                let newBal = currentBal + payBal;
                uD.balance = newBal.toFixed(2);
                
                if (!uD.transactions) uD.transactions = [];
                uD.transactions.unshift({
                    type: 'Deposit',
                    amount: payBal,
                    date: new Date().toISOString()
                });

                saveCurrentUserProfile(uD);

                setTimeout(() => {
                    console.log('Payment done! Reference:', response.reference);
                    showToast(`Payment successful! Ref: ${response.reference}\nAmount: ₦${payBal}`);
                    setTimeout(() => location.reload(), 3000);
                }, 1000);
            },

            onClose: function () {
                showToast('You closed the payment popup.');
            }
        });

        handler.openIframe(); 
    }
}

const withdrawAmt = document.getElementById('withdrawal-amount');
const pw1 = document.getElementById('pN1');
const pw2 = document.getElementById('pN2');
const pw3 = document.getElementById('pN3');
const pw4 = document.getElementById('pN4');

const withdrawBtn = () => {
    let withdrawBal = parseFloat(withdrawAmt.value.trim());

    if (withdrawBal < 1000) {
        showToast("Minimum Withdraw is ₦1,000")
    } else {
        const uD = getCurrentUserProfile();
        if (!uD) return;

        const pA = `${pw1.value}${pw2.value}${pw3.value}${pw4.value}`
        let currentBal = parseFloat(uD.balance || 0);

        if (pA.length < 4) {
            showToast('Please input your Transaction Pin')
            pw4.focus();
        } else {
            if (pA.trim() === uD.pin) {
                pw1.value = '';
                pw2.value = '';
                pw3.value = '';
                pw4.value = '';

                let newBal = currentBal - withdrawBal;

                if (currentBal < withdrawBal) {
                    showToast(`Insufficient Balance to Initiate this Withdrawal\nCurrent Balance: ₦${currentBal}`);
                } else {
                    uD.balance = newBal.toFixed(2);
                    
                    if (!uD.transactions) uD.transactions = [];
                    uD.transactions.unshift({
                        type: 'Withdrawal',
                        amount: withdrawBal,
                        date: new Date().toISOString()
                    });

                    saveCurrentUserProfile(uD);
                    setTimeout(() => {
                        showToast(`Withdrawal of ₦${withdrawBal} is done successfully...`);
                        setTimeout(() => location.reload(), 3000);
                    }, 1000);
                }
            } else {
                showToast('Incorrect Old PIN')
                pw4.focus();
            }
        }
    }
}

// Transfer Funds Feature
const transferFunds = () => {
    const tUser = document.getElementById('transferUsername').value.trim();
    const tAmt = parseFloat(document.getElementById('transferAmount').value);
    const p1 = document.getElementById('tP1').value;
    const p2 = document.getElementById('tP2').value;
    const p3 = document.getElementById('tP3').value;
    const p4 = document.getElementById('tP4').value;
    const pin = `${p1}${p2}${p3}${p4}`;

    if (!tUser || isNaN(tAmt) || tAmt <= 0) {
        showToast('Please enter a valid username and amount');
        return;
    }
    if (pin.length < 4) {
        showToast('Please enter your 4-digit PIN');
        return;
    }

    const uD = getCurrentUserProfile();
    if (pin !== uD.pin) {
        showToast('Incorrect PIN');
        return;
    }

    let currentBal = parseFloat(uD.balance || 0);
    if (currentBal < tAmt) {
        showToast('Insufficient Balance for this transfer');
        return;
    }

    let targetUsername = tUser.replace('@', '');
    if (targetUsername === uD.username) {
        showToast('You cannot transfer funds to yourself');
        return;
    }

    const allUsers = JSON.parse(localStorage.getItem('details') || '[]');
    const targetUserIndex = allUsers.findIndex(u => (u.user_name || u.username) === targetUsername);

    if (targetUserIndex === -1) {
        showToast('Recipient username not found');
        return;
    }

    // Deduct from Sender
    uD.balance = (currentBal - tAmt).toFixed(2);
    if (!uD.transactions) uD.transactions = [];
    uD.transactions.unshift({
        type: `Transfer to @${targetUsername}`,
        amount: tAmt,
        date: new Date().toISOString()
    });
    saveCurrentUserProfile(uD);

    // Add to Receiver
    let targetUser = allUsers[targetUserIndex];
    let targetBal = parseFloat(targetUser.balance || 0);
    targetUser.balance = (targetBal + tAmt).toFixed(2);
    if (!targetUser.transactions) targetUser.transactions = [];
    targetUser.transactions.unshift({
        type: `Transfer from @${uD.username}`,
        amount: tAmt,
        date: new Date().toISOString()
    });
    
    // Update target user in global details array and their specific email key
    allUsers[targetUserIndex] = targetUser;
    localStorage.setItem('details', JSON.stringify(allUsers));
    
    let targetEmail = targetUser.user_email || targetUser.email;
    if (targetEmail) {
        localStorage.setItem(targetEmail, JSON.stringify(targetUser));
    }

    showToast(`Successfully transferred ₦${tAmt} to @${targetUsername}`);
    
    // Close modal & reload
    const modalEl = document.getElementById('myModalTransfer');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
    
    setTimeout(() => location.reload(), 3000);
}

// Profile Image Upload Feature
window.addEventListener('DOMContentLoaded', () => {
    fetchInfo();
    
    const fileInput = document.getElementById('profileImageInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64String = event.target.result;
                    
                    const uD = getCurrentUserProfile();
                    uD.profileImage = base64String;
                    saveCurrentUserProfile(uD);
                    
                    const profileImg = document.getElementById('profileImageDisplay');
                    const navImg = document.getElementById('navAvatarImage');
                    if (profileImg) profileImg.src = base64String;
                    if (navImg) navImg.src = base64String;
                    
                    showToast('Profile image updated successfully!');
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

const toggleDarkMode = () => {
    const dmToggle = document.getElementById('darkModeToggle');
    if (!dmToggle) return;
    const isDark = dmToggle.checked;
    if (isDark) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    }
};

const createPinDash = () => {
    const p1 = document.getElementById('cPinNo1').value;
    const p2 = document.getElementById('cPinNo2').value;
    const p3 = document.getElementById('cPinNo3').value;
    const p4 = document.getElementById('cPinNo4').value;
    
    const c1 = document.getElementById('cCpinNo1').value;
    const c2 = document.getElementById('cCpinNo2').value;
    const c3 = document.getElementById('cCpinNo3').value;
    const c4 = document.getElementById('cCpinNo4').value;
    
    const pinA = `${p1}${p2}${p3}${p4}`;
    const pinB = `${c1}${c2}${c3}${c4}`;
    
    if (pinA === "" || pinB === "" || pinA.length < 4 || pinB.length < 4) {
        showToast('Please complete all PIN fields');
        return;
    }
    
    if (pinA !== pinB) {
        showToast('PINs do not match');
        document.getElementById('cCpinNo4').focus();
        return;
    }
    
    if (pinA === '0000') {
        showToast('Cannot use default PIN. Please choose a secure one.');
        return;
    }
    
    const uD = getCurrentUserProfile();
    if (!uD) return;
    
    uD.pin = pinA;
    saveCurrentUserProfile(uD);
    showToast('PIN created successfully!');
    
    const modalElement = document.getElementById('myModalCreatePinDash');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
};

const renderNotifications = (transactions) => {
    const list = document.getElementById('notification-list');
    const badge = document.getElementById('notification-badge');
    if (!list) return;

    if (!transactions || transactions.length === 0) {
        list.innerHTML = '<li class="dropdown-item-custom p-3 text-center text-muted">No recent transactions</li>';
        if (badge) badge.style.display = 'none';
        return;
    }

    if (badge) {
        badge.style.display = 'inline-block';
        badge.textContent = transactions.length > 9 ? '9+' : transactions.length;
    }

    list.innerHTML = transactions.map(t => {
        const isDep = t.type === 'Deposit';
        const dateObj = new Date(t.date);
        const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const iconColor = isDep ? '#4caf50' : '#f44336';
        const iconClass = isDep ? 'bi-arrow-down-left-circle-fill' : 'bi-arrow-up-right-circle-fill';
        
        return `
            <li class="dropdown-item-custom p-2 border-bottom" style="border-color: #f0f0f0;">
                <div class="d-flex align-items-center gap-3 w-100">
                    <i class="bi ${iconClass}" style="font-size: 24px; color: ${iconColor};"></i>
                    <div>
                        <div style="font-weight: 600; font-size: 14px;">${t.type}</div>
                        <div style="font-size: 12px; color: #888;">${dateStr}</div>
                    </div>
                    <div class="ms-auto" style="font-weight: 700; font-size: 14px; color: ${iconColor};">
                        ${isDep ? '+' : '-'}₦${parseFloat(t.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                </div>
            </li>
        `;
    }).join('');
};

const saveNextOfKin = () => {
    const name = document.getElementById('nokName').value.trim();
    const rel = document.getElementById('nokRel').value.trim();
    const phone = document.getElementById('nokPhone').value.trim();
    
    if (!name || !rel || !phone) {
        showToast('Please fill all fields');
        return;
    }
    
    const uD = getCurrentUserProfile();
    uD.nextOfKin = { name, relationship: rel, phone };
    saveCurrentUserProfile(uD);
    
    showToast('Next of Kin saved successfully');
    
    // Close modal
    const modalEl = document.getElementById('myModalNextOfKin');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
    
    fetchInfo();
};

const saveProfileDetails = () => {
    const gender = document.getElementById('editGender').value;
    const dob = document.getElementById('editDOB').value;
    
    const uD = getCurrentUserProfile();
    if (gender) uD.gender = gender;
    if (dob) uD.dob = dob;
    saveCurrentUserProfile(uD);
    
    showToast('Profile updated successfully');
    
    // Close modal
    const modalEl = document.getElementById('myModalEditProfile');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
    
    fetchInfo();
};

const resetPinAction = () => {
    const pass = document.getElementById('resetPinPass').value;
    const p1 = document.getElementById('rP1').value;
    const p2 = document.getElementById('rP2').value;
    const p3 = document.getElementById('rP3').value;
    const p4 = document.getElementById('rP4').value;
    const newPin = `${p1}${p2}${p3}${p4}`;
    
    if (!pass) {
        showToast('Please enter your account password');
        return;
    }
    if (newPin.length < 4) {
        showToast('Please enter a 4-digit PIN');
        return;
    }
    
    const uD = getCurrentUserProfile();
    if (pass !== uD.password) {
        showToast('Incorrect account password');
        return;
    }
    
    uD.pin = newPin;
    saveCurrentUserProfile(uD);
    
    showToast('PIN reset successfully!');
    document.getElementById('resetPinPass').value = '';
    document.getElementById('rP1').value = '';
    document.getElementById('rP2').value = '';
    document.getElementById('rP3').value = '';
    document.getElementById('rP4').value = '';
    
    // Close modal
    const modalEl = document.getElementById('myModalResetPin');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
};

const copyUsername = () => {
    const username = document.getElementById('unameProfile').value;
    if (username) {
        navigator.clipboard.writeText(username).then(() => {
            showToast('Username copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }
}
