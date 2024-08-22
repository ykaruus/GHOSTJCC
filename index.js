const { Builder, Browser, By, until } = require("selenium-webdriver");

(async function start() {
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    const user = {
        email: "e2404754@edu.mt.gov.br",
        password: "Potato1962"
    };

    try {
        // Navigate to Google's login page
        console.log('Navigating to Google login page');
        await driver.get("https://accounts.google.com/");

        // Enter the email
        console.log('Entering email');
        let emailField = await driver.wait(until.elementLocated(By.css("input[type='email']")), 10000);
        await emailField.sendKeys(user.email);
        await driver.findElement(By.css("#identifierNext")).click();

        // Wait for the password field to be present and visible
        console.log('Waiting for password field');
        let passwordField = null;
        for (let _trys = 0; _trys < 10; _trys++) {
            try {
                passwordField = await driver.wait(until.elementLocated(By.css("input[type='password']")), 10000);
                await driver.wait(until.elementIsVisible(passwordField), 10000);
                break;
            } catch (error) {
                if (_trys === 9) {
                    throw new Error("Password field not found or visible after multiple attempts.");
                }
                await driver.sleep(1000);
            }
        }

        // Interact with the password field
        console.log('Entering password');
        await passwordField.sendKeys(user.password);
        let passwordNextButton = await driver.findElement(By.css("#passwordNext"));
        await passwordNextButton.click();

        // Wait for the navigation to complete
        console.log('Waiting for Google account navigation');
        await driver.wait(until.urlContains("https://myaccount.google.com/?pli=1"), 10000);

        // Navigate to Plurall
        console.log('Navigating to Plurall login page');
        await driver.get("https://home.plurall.net/");

        // Wait for the Plurall elements to be present and visible
        console.log('Waiting for Plurall elements');
        let $emailInstucional, $password, $button;
        try {
            $emailInstucional = await driver.wait(until.elementLocated(By.css(".css-rw00cr")), 10000);
            $password = await driver.wait(until.elementLocated(By.css(".css-a108v0")), 10000);
            $button = await driver.wait(until.elementLocated(By.css(".css-13cbnst.e1ttrbcd3")), 10000);
        } catch (error) {
            throw new Error("Plurall login elements not found.");
        }

        // Scroll into view and interact
        console.log('Scrolling into view and interacting with elements');
        await driver.executeScript("arguments[0].scrollIntoView(true);", $button);

        await $emailInstucional.sendKeys(user.email);
        await $password.sendKeys(user.password);
        await $button.click();

        // Handle the button again if needed
        console.log('Checking and interacting with secondary button if necessary');
        try {
            $button = await driver.wait(until.elementLocated(By.css(".css-8m1k0h.e1ttrbcd3")), 20000);
            await $button.click();
        } catch (error) {
            console.error('Error locating or interacting with button:', error);
        }

        
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        console.log('Quitting the driver');
     //   await driver.quit(); // Make sure to quit the driver in the finally block
    }
})();
