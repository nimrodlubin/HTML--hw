import User from "./models/User.js";
import {
    getUserFromDB, saveUserToDB, addUser, updateUser, deleteUser, findUserByUP,
    isEmailTaken, isPasswordValid, isAgeValid, loadCitiesIntoDatalist,
    isUsernameValid, isEmailValid, isHebrewStreetValid, isHouseNumberValid, hasEmptyValue,
    ADMIN_USERNAME, ADMIN_PASSWORD
} from "./function.js";

if (document.getElementById("LoginForm")) {
    setupLoginPage();
}
if (document.getElementById("registerForm")) {
    setupRegisterPage();
}
if (document.querySelector(".ProfilePage")) {
    setupProfilePage();
}
if (document.getElementById("AdminPage")) {
    setupAdminPage();
} //השתמשתי בדום על מנת לבדוק איזה אמנו ייחודי קיים 
function setupRegisterPage() {
    loadCitiesIntoDatalist("citiesList");

    let avatarData = "";

    const avatarInput = document.getElementById("regAvatar");
    avatarInput.addEventListener("change", function (event) {
        event.preventDefault();
        const file = avatarInput.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function () {
            avatarData = reader.result;
        };
        reader.readAsDataURL(file);
    });

    const registerBTN = document.getElementById("registerForm");
    registerBTN.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("regUsername").value;
        const password = document.getElementById("regPassword").value;
        const passCon = document.getElementById("registerPassCon").value;
        const firstName = document.getElementById("regFirstName").value;
        const lastName = document.getElementById("regLastName").value;
        const email = document.getElementById("regEmail").value;
        const birthday = document.getElementById("regBirthday").value;
        const city = document.getElementById("regCity").value;
        const street = document.getElementById("regStreet").value;
        const hnum = document.getElementById("regHnum").value;

        if (hasEmptyValue([username, password, passCon, firstName, lastName, email, birthday, city, street, hnum])) {
            alert("יש למלא את כל השדות.");
            return;
        }
        if (!isUsernameValid(username)) {
            alert("שם המשתמש יכול להכיל אותיות לועזיות בלבד ועד 60 תווים.");
            return;
        }
        if (!isEmailValid(email)) {
            alert("כתובת המייל יכולה להכיל אותיות לועזיות ותווים מיוחדים בלבד, @ פעם אחת וסיומת .com בלבד.");
            return;
        }
        if (!isHebrewStreetValid(street)) {
            alert("שם הרחוב יכול להכיל אותיות בעברית בלבד.");
            return;
        }
        if (!isHouseNumberValid(hnum)) {
            alert("מספר הבית חייב להיות מספר שלם שאינו שלילי.");
            return;
        }
        if (password !== passCon) {
            alert("הסיסמאות אינן תואמות.");
            return;
        }
        if (isEmailTaken(email)) {
            alert("כתובת המייל כבר קיימת במערכת.");
            return;
        }
        if (!isPasswordValid(password)) {
            alert("הסיסמה חייבת להכיל בין 7 ל-12 תווים, לפחות אות גדולה אחת, מספר אחד ותו מיוחד אחד.");
            return;
        }
        if (!isAgeValid(birthday)) {
            alert("תאריך הלידה אינו הגיוני.");
            return;
        }
        const newUser = new User(username, password, avatarData, firstName, lastName, email, birthday, city, street, hnum);
        addUser(newUser);
        alert("נרשמת בהצלחה!");
        window.location.href = "index.html";
    });
}
function setupLoginPage() {
    const loginBTN = document.getElementById("loginBTN");
    loginBTN.addEventListener("click", function (event) {
        event.preventDefault();
        const username = document.getElementById("LogUserName").value;
        const password = document.getElementById("loginPassword").value;

        if (hasEmptyValue([username, password])) {
            alert("יש למלא שם משתמש וסיסמה.");
            return;
        }
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            sessionStorage.setItem("currentUser", JSON.stringify({ UserName: username, isAdmin: true }));
            window.location.href = "Manger.html";
            return;
        }
        const user = findUserByUP(username, password);
        if (!user) {
            alert("שם המשתמש או הסיסמה שגויים.");
            return;
        }
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "profile.html";
    });
}
function setupProfilePage() {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    let avatarData = "";

    const avatarInput = document.getElementById("editAvatar");
    avatarInput.addEventListener("change", function (event) {
        event.preventDefault();
        const file = avatarInput.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function () {
            avatarData = reader.result;
        };
        reader.readAsDataURL(file);
    });

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    renderProfile(currentUser);
    loadCitiesIntoDatalist("editCitiesList");

    document.getElementById("editProfileBTN").addEventListener("click", function () {
        fillEditForm(currentUser);
        document.getElementById("editProfileSection").hidden = false;
    });

    document.getElementById("gameBTN").addEventListener("click", function () {
        window.location.href = "game.html";
    });

    document.getElementById("logoutBTN").addEventListener("click", function () {
        sessionStorage.removeItem("currentUser");
        window.location.href = "index.html";
    });

    document.getElementById("saveEditBTN").addEventListener("click", function () {
        const username = document.getElementById("editUsername").value;
        const password = document.getElementById("editPassword").value;
        const passCon = document.getElementById("editPassCon").value;
        const firstName = document.getElementById("editFirstName").value;
        const lastName = document.getElementById("editLastName").value;
        const email = document.getElementById("editEmail").value;
        const birthday = document.getElementById("editBirthday").value;
        const city = document.getElementById("editCity").value;
        const street = document.getElementById("editStreet").value;
        const hnum = document.getElementById("editHnum").value;

        if (hasEmptyValue([username, password, passCon, firstName, lastName, email, birthday, city, street, hnum])) {
            alert("יש למלא את כל השדות.");
            return;
        }
        if (!isUsernameValid(username)) {
            alert("שם המשתמש יכול להכיל אותיות לועזיות בלבד ועד 60 תווים.");
            return;
        }
        if (!isEmailValid(email)) {
            alert("כתובת המייל יכולה להכיל אותיות לועזיות ותווים מיוחדים בלבד, @ פעם אחת וסיומת .com בלבד.");
            return;
        }
        if (!isHebrewStreetValid(street)) {
            alert("שם הרחוב יכול להכיל אותיות בעברית בלבד.");
            return;
        }
        if (!isHouseNumberValid(hnum)) {
            alert("מספר הבית חייב להיות מספר שלם שאינו שלילי.");
            return;
        }
        if (password !== passCon) {
            alert("הסיסמאות אינן תואמות.");
            return;
        }
        if (!isPasswordValid(password)) {
            alert("הסיסמה חייבת להכיל בין 7 ל-12 תווים, לפחות אות גדולה אחת, מספר אחד ותו מיוחד אחד.");
            return;
        }
        if (!isAgeValid(birthday)) {
            alert("תאריך הלידה אינו הגיוני.");
            return;
        }
        if (isEmailTaken(email, currentUser.UserName)) {
            alert("כתובת המייל כבר קיימת במערכת.");
            return;
        }

        const updatedUser = {
            UserName: username,
            Password: password,
            Image: avatarData || currentUser.Image,
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Birthday: birthday,
            City: city,
            Street: street,
            Number: hnum
        };

        updateUser(currentUser.UserName, updatedUser);
        sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
        currentUser = updatedUser;

        renderProfile(currentUser);
        document.getElementById("editProfileSection").hidden = true;
        alert("הפרטים עודכנו בהצלחה!");
    });
}
function renderProfile(user) {
    document.getElementById("profileGreetingName").textContent = user.FirstName;
    document.getElementById("profileFullName").textContent = user.FirstName + " " + user.LastName;
    document.getElementById("profileUsername").textContent = user.UserName;
    document.getElementById("profileEmail").textContent = user.Email;
    document.getElementById("profileAddress").textContent = user.Street + " " + user.Number + ", " + user.City;
    document.getElementById("profileBirthday").textContent = user.Birthday;
    if (user.Image) {
        document.getElementById("profilePic").src = user.Image;
    }
}
function fillEditForm(user) {
    document.getElementById("editUsername").value = user.UserName;
    document.getElementById("editPassword").value = user.Password;
    document.getElementById("editPassCon").value = user.Password;
    document.getElementById("editFirstName").value = user.FirstName;
    document.getElementById("editLastName").value = user.LastName;
    document.getElementById("editEmail").value = user.Email;
    document.getElementById("editBirthday").value = user.Birthday;
    document.getElementById("editCity").value = user.City;
    document.getElementById("editStreet").value = user.Street;
    document.getElementById("editHnum").value = user.Number;
}
function setupAdminPage() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = "index.html";
        return;
    }

    loadCitiesIntoDatalist("adminEditCitiesList");
    renderUsersTable();

    document.getElementById("adminCancelEditBTN").addEventListener("click", function (event) {
        event.preventDefault()
        document.getElementById("adminEditSection").hidden = true;
    });

    document.getElementById("adminSaveEditBTN").addEventListener("click", function () {
        const username = document.getElementById("adminEditUsername").value;
        const password = document.getElementById("adminEditPassword").value;
        const passCon = document.getElementById("adminEditPassCon").value;
        const firstName = document.getElementById("adminEditFirstName").value;
        const lastName = document.getElementById("adminEditLastName").value;
        const email = document.getElementById("adminEditEmail").value;
        const birthday = document.getElementById("adminEditBirthday").value;
        const city = document.getElementById("adminEditCity").value;
        const street = document.getElementById("adminEditStreet").value;
        const hnum = document.getElementById("adminEditHnum").value;

        if (hasEmptyValue([username, password, passCon, firstName, lastName, email, birthday, city, street, hnum])) {
            alert("יש למלא את כל השדות.");
            return;
        }
        if (!isUsernameValid(username)) {
            alert("שם המשתמש יכול להכיל אותיות לועזיות בלבד ועד 60 תווים.");
            return;
        }
        if (!isEmailValid(email)) {
            alert("כתובת המייל יכולה להכיל אותיות לועזיות ותווים מיוחדים בלבד, @ פעם אחת וסיומת .com בלבד.");
            return;
        }
        if (!isHebrewStreetValid(street)) {
            alert("שם הרחוב יכול להכיל אותיות בעברית בלבד.");
            return;
        }
        if (!isHouseNumberValid(hnum)) {
            alert("מספר הבית חייב להיות מספר שלם שאינו שלילי.");
            return;
        }

        if (password !== passCon) {
            alert("הסיסמאות אינן תואמות.");
            return;
        }

        const originalUsername = document.getElementById("adminEditForm").dataset.editingUser;

        if (!isPasswordValid(password)) {
            alert("הסיסמה חייבת להכיל בין 7 ל-12 תווים, לפחות אות גדולה אחת, מספר אחד ותו מיוחד אחד.");
            return;
        }
        if (!isAgeValid(birthday)) {
            alert("תאריך הלידה אינו הגיוני.");
            return;
        }
        if (isEmailTaken(email, originalUsername)) {
            alert("כתובת המייל כבר קיימת במערכת.");
            return;
        }

        const updatedUser = {
            UserName: username,
            Password: password,
            Image: document.getElementById("adminEditForm").dataset.editingImage || "",
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Birthday: birthday,
            City: city,
            Street: street,
            Number: hnum
        };

        updateUser(originalUsername, updatedUser);
        document.getElementById("adminEditSection").hidden = true;
        renderUsersTable();
    });
}
function renderUsersTable() {
    const users = getUserFromDB();
    const tbody = document.getElementById("usersTableInfo");
    tbody.innerHTML = "";

    users.forEach(function (user) {
        const row = document.createElement("tr");

        const imgCell = document.createElement("td");
        const img = document.createElement("img");
        if (user.Image) {
            img.src = user.Image;
        }
        img.alt = "תמונה";
        img.className = "table-avatar";
        imgCell.appendChild(img);

        const usernameCell = document.createElement("td");
        usernameCell.textContent = user.UserName;

        const fullNameCell = document.createElement("td");
        fullNameCell.textContent = user.FirstName + " " + user.LastName;

        const birthdayCell = document.createElement("td");
        birthdayCell.textContent = user.Birthday;

        const addressCell = document.createElement("td");
        addressCell.textContent = user.Street + " " + user.Number + ", " + user.City;

        const emailCell = document.createElement("td");
        emailCell.textContent = user.Email;

        const actionsCell = document.createElement("td");

        const editBTN = document.createElement("button");
        editBTN.textContent = "עריכה";
        editBTN.addEventListener("click", function () {
            openAdminEditForm(user);
        });

        const deleteBTN = document.createElement("button");
        deleteBTN.textContent = "מחיקה";
        deleteBTN.addEventListener("click", function () {
            deleteUser(user.UserName);
            renderUsersTable();
        });

        actionsCell.appendChild(editBTN);
        actionsCell.appendChild(deleteBTN);

        row.appendChild(imgCell);
        row.appendChild(usernameCell);
        row.appendChild(fullNameCell);
        row.appendChild(birthdayCell);
        row.appendChild(addressCell);
        row.appendChild(emailCell);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}
function openAdminEditForm(user) {
    document.getElementById("adminEditUsername").value = user.UserName;
    document.getElementById("adminEditPassword").value = user.Password;
    document.getElementById("adminEditPassCon").value = user.Password;
    document.getElementById("adminEditFirstName").value = user.FirstName;
    document.getElementById("adminEditLastName").value = user.LastName;
    document.getElementById("adminEditEmail").value = user.Email;
    document.getElementById("adminEditBirthday").value = user.Birthday;
    document.getElementById("adminEditCity").value = user.City;
    document.getElementById("adminEditStreet").value = user.Street;
    document.getElementById("adminEditHnum").value = user.Number;

    document.getElementById("adminEditForm").dataset.editingUser = user.UserName;
    document.getElementById("adminEditForm").dataset.editingImage = user.Image || "";
    document.getElementById("adminEditSection").hidden = false;
}



