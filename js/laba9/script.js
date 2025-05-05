document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const successMessage = document.getElementById('successMessage');
    const closeSuccessMessage = document.getElementById('closeSuccessMessage');

    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    registerTab.addEventListener('click', function() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

    // Country and city selection
    const countrySelect = document.getElementById('country');
    const citySelect = document.getElementById('city');

    const cities = {
        'Ukraine': ['Kyiv', 'Lviv', 'Kharkiv', 'Odesa', 'Dnipro'],
        'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
        'UK': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Edinburgh'],
        'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
        'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'],
        'Poland': ['Warsaw', 'Krakow', 'Lodz', 'Wroclaw', 'Poznan'],
        'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo'],
        'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza']
    };

    countrySelect.addEventListener('change', function() {
        const country = this.value;
        
        // Clear city select
        citySelect.innerHTML = '<option value="">Select City</option>';
        
        // Populate cities based on selected country
        if (country) {
            citySelect.disabled = false;
            cities[country].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        } else {
            citySelect.disabled = true;
        }
    });

    // Close success message
    closeSuccessMessage.addEventListener('click', function() {
        successMessage.style.display = 'none';
    });

    // Form validation
    const loginFormElement = document.getElementById('login');
    const registerFormElement = document.getElementById('register');

    // Validation functions
    function showError(input, message) {
        const formGroup = input.parentElement.classList.contains('password-container') 
            ? input.parentElement.parentElement 
            : input.parentElement;
        
        const errorDisplay = formGroup.querySelector('.error-message');
        input.classList.add('invalid');
        input.classList.remove('valid');
        errorDisplay.textContent = message;
    }

    function showSuccess(input) {
        const formGroup = input.parentElement.classList.contains('password-container') 
            ? input.parentElement.parentElement 
            : input.parentElement;
            
        const errorDisplay = formGroup.querySelector('.error-message');
        input.classList.add('valid');
        input.classList.remove('invalid');
        errorDisplay.textContent = '';
    }

    function checkRequired(inputArray) {
        let isValid = true;
        inputArray.forEach(input => {
            if (input.value.trim() === '') {
                showError(input, 'Це поле є обов\'язковим');
                isValid = false;
            } else {
                showSuccess(input);
            }
        });
        return isValid;
    }

    function checkLength(input, min, max) {
        if (input.value.length < min) {
            showError(input, `Має бути не менше ${min} символів`);
            return false;
        } else if (input.value.length > max) {
            showError(input, `Має бути не більше ${max} символів`);
            return false;
        } else {
            showSuccess(input);
            return true;
        }
    }

    function checkEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
            showError(input, 'Введіть коректну електронну адресу');
            return false;
        } else {
            showSuccess(input);
            return true;
        }
    }

    function checkPhone(input) {
        const phoneRegex = /^\+380\d{9}$/;
        if (!phoneRegex.test(input.value.trim())) {
            showError(input, 'Введіть коректний номер телефону у форматі +380XXXXXXXXX');
            return false;
        } else {
            showSuccess(input);
            return true;
        }
    }

    function checkPasswordsMatch(password1, password2) {
        if (password1.value !== password2.value) {
            showError(password2, 'Паролі не співпадають');
            return false;
        } else {
            return true;
        }
    }

    function checkAge(input) {
        const today = new Date();
        const birthDate = new Date(input.value);
        
        // Check if date is in future
        if (birthDate > today) {
            showError(input, 'Дата народження не може бути в майбутньому');
            return false;
        }
        
        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age < 12) {
            showError(input, 'Вам має бути не менше 12 років для реєстрації');
            return false;
        } else {
            showSuccess(input);
            return true;
        }
    }

    function checkRadio(radioGroup, errorElement) {
        let isChecked = false;
        radioGroup.forEach(radio => {
            if (radio.checked) {
                isChecked = true;
            }
        });
        
        if (!isChecked) {
            errorElement.textContent = 'Виберіть одне з значень';
            return false;
        } else {
            errorElement.textContent = '';
            return true;
        }
    }

    function checkSelect(select) {
        if (select.value === '') {
            showError(select, 'Це поле є обов\'язковим');
            return false;
        } else {
            showSuccess(select);
            return true;
        }
    }

    // Login form validation
    loginFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username');
        const password = document.getElementById('login-password');
        
        let isValid = true;
        
        // Check required fields
        isValid = checkRequired([username, password]) && isValid;
        
        // Check password length
        if (password.value.trim() !== '') {
            isValid = checkLength(password, 6, 30) && isValid;
        }
        
        if (isValid) {
            // Form is valid, show success message (for demo purposes)
            alert("Успішна авторизація!");
            loginFormElement.reset();
            
            // Reset validation styling
            const formControls = loginFormElement.querySelectorAll('.form-control');
            formControls.forEach(input => {
                input.classList.remove('valid');
                input.classList.remove('invalid');
            });
        }
    });

    // Registration form validation
    registerFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const password = document.getElementById('register-password');
        const confirmPassword = document.getElementById('confirmPassword');
        const phone = document.getElementById('phone');
        const dateOfBirth = document.getElementById('dateOfBirth');
        const sexRadios = document.querySelectorAll('input[name="sex"]');
        const sexErrorElement = document.querySelector('input[name="sex"]').parentElement.querySelector('.error-message');
        const country = document.getElementById('country');
        const city = document.getElementById('city');
        
        let isValid = true;
        
        // Check required fields
        isValid = checkRequired([firstName, lastName, email, password, confirmPassword, phone, dateOfBirth, country, city]) && isValid;
        
        // Check name lengths
        if (firstName.value.trim() !== '') {
            isValid = checkLength(firstName, 3, 15) && isValid;
        }
        
        if (lastName.value.trim() !== '') {
            isValid = checkLength(lastName, 3, 15) && isValid;
        }
        
        // Check email
        if (email.value.trim() !== '') {
            isValid = checkEmail(email) && isValid;
        }
        
        // Check password length
        if (password.value.trim() !== '') {
            isValid = checkLength(password, 6, 30) && isValid;
        }
        
        // Check passwords match
        if (password.value.trim() !== '' && confirmPassword.value.trim() !== '') {
            isValid = checkPasswordsMatch(password, confirmPassword) && isValid;
        }
        
        // Check phone
        if (phone.value.trim() !== '') {
            isValid = checkPhone(phone) && isValid;
        }
        
        // Check date of birth
        if (dateOfBirth.value !== '') {
            isValid = checkAge(dateOfBirth) && isValid;
        }
        
        // Check sex radio
        isValid = checkRadio(sexRadios, sexErrorElement) && isValid;
        
        // Check country and city
        if (country.value !== '') {
            isValid = checkSelect(country) && isValid;
        }
        
        if (!country.value) {
            showError(city, 'Спочатку виберіть країну');
            isValid = false;
        } else if (city.value === '') {
            showError(city, 'Це поле є обов\'язковим');
            isValid = false;
        } else {
            showSuccess(city);
        }
        
        if (isValid) {
            // Form is valid, show success message
            successMessage.style.display = 'block';
            registerFormElement.reset();
            
            // Reset validation styling
            const formControls = registerFormElement.querySelectorAll('.form-control');
            formControls.forEach(input => {
                input.classList.remove('valid');
                input.classList.remove('invalid');
            });
            
            // Reset sex error message
            sexErrorElement.textContent = '';
            
            // Reset city select
            city.innerHTML = '<option value="">Select City</option>';
            city.disabled = true;
        }
    });
});