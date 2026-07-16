export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "admin1234admin";

export function getUserFromDB() {
    let users = localStorage.getItem("userDB");
    if (users != null) {
        return JSON.parse(users);
    }
    return [];
}
export function saveUserToDB(users) {
    try {
        localStorage.setItem("userDB", JSON.stringify(users));
    } catch (error) {
        alert("שגיאה: לא ניתן לשמור. ייתכן שהתמונה שהעלית כבדה מדי וחורגת ממגבלת הזיכרון (5MB). נסה להעלות תמונה קטנה יותר.");
        console.error("Local Storage Error:", error);
    }
}
export function addUser(newUser) {
    const users = getUserFromDB();
    users.splice(users.length, 0, newUser); // מוסיף איבר במערך
    saveUserToDB(users);
}
export function updateUser(username, updatedUser) {
    const users = getUserFromDB();
    for (let i = 0; i < users.length; i++) {
        if (users[i].UserName === username) {
            users.splice(i, 1, updatedUser); //מחליף איבר במערך
            break;
        }
    }
    saveUserToDB(users);
}
export function deleteUser(username) {
    const users = getUserFromDB();
    const remainingUsers = users.filter(function (user) {
        return user.UserName !== username;
    });
    saveUserToDB(remainingUsers);
}
export function findUserByUP(username, password) {
    const users = getUserFromDB();
    const foundUser = users.find(function (user) {
        return user.UserName === username && user.Password === password;
    });
    return foundUser || null;
}
export function isEmailTaken(email, excludeUsername = "") {
    const users = getUserFromDB();
    return users.some(function (user) {
        return user.Email === email && user.UserName !== excludeUsername;
    });
}
export function isUsernameValid(username) {
    return /^[A-Za-z0-9!@#$%^&*()_+=\-{}\[\]:;"'<>,.?\/\\|~]{1,60}$/.test(username);
}
export function isEmailValid(email) {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.com$/.test(email);
}
export function isHebrewStreetValid(street) {
    return /^[\u0590-\u05FF ]+$/.test(street);
}
export function isHouseNumberValid(number) {
    return /^\d+$/.test(number) && Number(number) >= 0;
}
export function isPasswordValid(password) {
    if (password.length < 7 || password.length > 12) {
        return false; // השארתי ליתר ביטחון 
    }
    let hasUpper = false;
    let hasNum = false;
    let hasSpecial = false;
    const specials = "!@#$%^&*_-+=";

    for (let i = 0; i < password.length; i++) {
        const char = password[i];
        if (char >= "A" && char <= "Z") {
            hasUpper = true;
        }
        if (char >= "0" && char <= "9") {
            hasNum = true;
        }
        for (let j = 0; j < specials.length; j++) {
            if (char === specials[j]) {
                hasSpecial = true;
            }
        }
    }
    return hasUpper && hasNum && hasSpecial;
}
export function isAgeValid(birthdayString) {
    const birthday = new Date(birthdayString);
    const today = new Date();

    if (birthday > today) {
        return false;
    }
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age > 0 && age < 120;
}
export function hasEmptyValue(values) {
    for (let i = 0; i < values.length; i++) {
        if (values[i] === "") {
            return true;
        }
    }
    return false;
}
export async function loadCitiesIntoDatalist(datalistId) {
    const datalist = document.getElementById(datalistId);
    if (!datalist) {
        return;
    }
    try {
        const response = await fetch("https://data.gov.il/api/3/action/datastore_search?resource_id=e9701dcb-9f1c-43bb-bd44-eb380ade542f&limit=2000");
        if (!response.ok) {
            console.log("Error status: " + response.status);
            return;
        }
        const data = await response.json();
        data.result.records.forEach(function (record) {
            const cityName = record.name_in_hebrew.trim();
            const option = document.createElement("option");
            option.value = cityName;
            option.text = cityName;
            datalist.appendChild(option);
        });
    } catch (error) {
        console.error("שגיאה בטעינת רשימת הערים", error);
    }
}
