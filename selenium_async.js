require("chromedriver");
let wDriver = require("selenium-webdriver");
let fs = require("fs");
// let {Key} = require("selenium-webdriver")
let credentialsFile = process.argv[2];
let login, email, pwd;
let bldr = new wDriver.Builder();
let driver = bldr.forBrowser("chrome").build();
let questionsFile = require("./questions.js");
(async function () {
    try {
        // await driver.manage().window().maximize();
        await loginHelper();
        let profileTabOpen = await driver.findElement(wDriver.By.css("a[data-analytics='NavBarProfileDropDown']"));
        await profileTabOpen.click();
        let adminOpen = await driver.findElement(wDriver.By.css("a[data-analytics='NavBarProfileDropDownAdministration']"));
        await adminOpen.click();
        await waitForLoader();
        let challengeOpen = await driver.findElement(wDriver.By.css("a[href='/administration/challenges']"));
        await challengeOpen.click();
        let challengepageLink = await driver.getCurrentUrl();
        await driver.get(challengepageLink);
        for(let i = 0 ; i<questionsFile.length;i++)
        {
        await createChallenge(questionsFile[i],challengepageLink);
        await driver.get(challengepageLink);
        }
        // document.getElementsByName  
    }
    catch (err) {

    }
})();
async function loginHelper() {

    let data = await fs.promises.readFile(credentialsFile, "utf-8");
    let credentials = JSON.parse(data);
    console.log(credentials);
    login = credentials.login;
    email = credentials.email;
    pwd = credentials.pwd;
    let loginPageOpened = driver.get(login);

    await loginPageOpened;
    await driver.manage().setTimeouts({
        implicit: 10000,
        pageLoad: 10000
    })
    let emailBox = await driver.findElement(wDriver.By.css("#input-1"));
    await emailBox.sendKeys(email);
    let pBox = await driver.findElement(wDriver.By.css("#input-2"));
    await pBox.sendKeys(pwd);
    let loginBtn = await driver.findElement(wDriver.By.css("button[data-analytics='LoginPassword']"));
    await loginBtn.click();
}
async function createChallenge(challenge) {
    try {
        let newChallengeClick = await driver.findElement(wDriver.By.css("button.btn.btn-green.backbone.pull-right"));
        await newChallengeClick.click();
        let challengeName = await driver.findElement(wDriver.By.css("#name"));
        await challengeName.sendKeys(challenge["Challenge Name"]);
        let challengeDesc = await driver.findElement(wDriver.By.css("#preview"));
        await challengeDesc.sendKeys(challenge["Description"]);
        
        await driver.executeScript("document.querySelector('#problem_statement-container .CodeMirror.cm-s-default.CodeMirror-wrap div').style.height='10px'");
        // await driver.executeScript(
        // "document.querySelector('#problem_statement-container .CodeMirror.cm-s-default.CodeMirror-wrap div').style.height='10px'");
        let psBox = await driver.findElement(wDriver.By.css("#problem_statement-container .CodeMirror.cm-s-default.CodeMirror-wrap textarea"));
        await psBox.sendKeys(challenge["Problem Statement"]);
        
        await driver.executeScript("document.querySelector('#input_format-container .CodeMirror.cm-s-default.CodeMirror-wrap div').style.height='10px'");
        let ipFormatBox = await driver.findElement(wDriver.By.css("#input_format-container .CodeMirror.cm-s-default.CodeMirror-wrap textarea"));
        await ipFormatBox.sendKeys(challenge["Input Format"]);
        
        await driver.executeScript("document.querySelector('#constraints-container .CodeMirror.cm-s-default.CodeMirror-wrap div').style.height='10px'");
        let constraintBox = await driver.findElement(wDriver.By.css("#constraints-container .CodeMirror.cm-s-default.CodeMirror-wrap textarea"));
        await constraintBox.sendKeys(challenge["Constraints"]);
        
        await driver.executeScript("document.querySelector('#output_format-container .CodeMirror.cm-s-default.CodeMirror-wrap div').style.height='10px'");
        let opFormatBox = await driver.findElement(wDriver.By.css("#output_format-container .CodeMirror.cm-s-default.CodeMirror-wrap textarea"));
        await opFormatBox.sendKeys(challenge["Output Format"]);

        let tagsBox = await driver.findElement(wDriver.By.css(".tagsinput input"));
        await tagsBox.sendKeys(challenge["Tags"]);

        await tagsBox.sendKeys(wDriver.Key.ENTER);
        let submitBtn = await driver.findElement(wDriver.By.css(".save-challenge.btn.btn-green"));
        await submitBtn.click();
        // document.getElementById('tags-tags').attributes.value=
    }

    catch (err) { }
}

async function waitForLoader() {
    let loader = await driver.findElement(wDriver.By.css("#ajax-msg"));

    await driver.wait(wDriver.until.elementIsNotVisible(loader));
}