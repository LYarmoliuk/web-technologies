// Завдання 1: Оператори порівняння


function findMinMax(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) {
      return { min: null, max: null };
    }
    
    let min = numbers[0];
    let max = numbers[0];
    
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] < min) {
        min = numbers[i];
      }
      if (numbers[i] > max) {
        max = numbers[i];
      }
    }
    
    return { min, max };
  }

  console.log("=== Завдання 1 ===");
  
  
  const testArray = [3, 7, 2, 9, 5, 1, 8];
  console.log("Масив:", testArray);
  console.log("Результат findMinMax:", findMinMax(testArray));
  
  
  function compareObjects(obj1, obj2) {
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    
    if (keys1.length !== keys2.length) {
      return false;
    }
    
   
    for (let key of keys1) {
      if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
        return false;
      }
    }
    
    return true;
  }
  
  
  const object1 = { a: 1, b: 2, c: 3 };
  const object2 = { a: 1, b: 2, c: 3 };
  const object3 = { a: 1, b: 2, d: 4 };
  const object4 = { a: 1, b: 2, c: 4 };
  
  console.log("Порівняння object1 і object2:", compareObjects(object1, object2)); 
  //console.log("Порівняння object1 і object3:", compareObjects(object1, object3)); 
  //console.log("Порівняння object1 і object4:", compareObjects(object1, object4)); 
  // Завдання 2: Логічні оператори
  
 
  function isInRange(number, min, max) {
    return number >= min && number <= max;
  }
  console.log("=== Завдання 2 ===");

  
  console.log("15 в діапазоні [10, 20]:", isInRange(15, 10, 20)); 
  console.log("5 в діапазоні [10, 20]:", isInRange(5, 10, 20)); 
  console.log("25 в діапазоні [10, 20]:", isInRange(25, 10, 20)); 
  
  
  let status = true;
  console.log("Початковий статус:", status);
  
  status = !status; 
  console.log("Статус після NOT:", status);
  
  status = !status; 
  console.log("Статус після повторного NOT:", status);
  
  // Завдання 3: Умовні розгалуження
  console.log("=== Завдання 3.1 ===");
  
  function getGradeTextUsingIf(score) {
    
    if (score >= 90 && score <= 100) {
      return "відмінно";
    } else if (score >= 75 && score < 90) {
      return "добре";
    } else if (score >= 60 && score < 75) {
      return "задовільно";
    } else if (score >= 0 && score < 60) {
      return "незадовільно";
    } else {
      return "некоректна оцінка";
    }
  }
  
 
  function getGradeTextUsingTernary(score) {
    return (score >= 90 && score <= 100) ? "відмінно" :
           (score >= 75 && score < 90) ? "добре" :
           (score >= 60 && score < 75) ? "задовільно" :
           (score >= 0 && score < 60) ? "незадовільно" :
           "некоректна оцінка";
  }
  
  
  console.log("Оцінка 95 (if):", getGradeTextUsingIf(95));
  console.log("Оцінка 82 (if):", getGradeTextUsingIf(82));
  console.log("Оцінка 65 (if):", getGradeTextUsingIf(65));
  console.log("Оцінка 45 (if):", getGradeTextUsingIf(45));
  console.log("Оцінка -5 (if):", getGradeTextUsingIf(-5));
  
  console.log("Оцінка 95 (тернарний):", getGradeTextUsingTernary(95));
  console.log("Оцінка 82 (тернарний):", getGradeTextUsingTernary(82));
  console.log("Оцінка 65 (тернарний):", getGradeTextUsingTernary(65));
  console.log("Оцінка 45 (тернарний):", getGradeTextUsingTernary(45));
  console.log("Оцінка -5 (тернарний):", getGradeTextUsingTernary(-5));

  console.log("=== Завдання 3.2 ===");
  
 
  function getSeasonUsingIf(month) {
    
    if (month < 1 || month > 12 || !Number.isInteger(month)) {
      return "некоректний місяць";
    }
    
    if (month === 12 || month === 1 || month === 2) {
      return "зима";
    } else if (month >= 3 && month <= 5) {
      return "весна";
    } else if (month >= 6 && month <= 8) {
      return "літо";
    } else {
      return "осінь";
    }
  }
  
  
  function getSeasonUsingTernary(month) {
    return (month < 1 || month > 12 || !Number.isInteger(month)) ? "некоректний місяць" :
           (month === 12 || month === 1 || month === 2) ? "зима" :
           (month >= 3 && month <= 5) ? "весна" :
           (month >= 6 && month <= 8) ? "літо" :
           "осінь";
  }
  
  
  console.log("Місяць 1 (if):", getSeasonUsingIf(1));
  console.log("Місяць 4 (if):", getSeasonUsingIf(4));
  console.log("Місяць 7 (if):", getSeasonUsingIf(7));
  console.log("Місяць 10 (if):", getSeasonUsingIf(10));
  console.log("Місяць 13 (if):", getSeasonUsingIf(13));
  
  console.log("Місяць 1 (тернарний):", getSeasonUsingTernary(1));
  console.log("Місяць 4 (тернарний):", getSeasonUsingTernary(4));
  console.log("Місяць 7 (тернарний):", getSeasonUsingTernary(7));
  console.log("Місяць 10 (тернарний):", getSeasonUsingTernary(10));
  console.log("Місяць 13 (тернарний):", getSeasonUsingTernary(13));