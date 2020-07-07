const { Builder, By, Key, until, error } = require('selenium-webdriver');
const { assert } = require('chai');
import { globals } from '../global';

let driver = new Builder().forBrowser('chrome').build();

describe('SHE Software Test', function () {
    describe('New Air Emissions Record', function () {
        it('Access Assure', async function () {
            try {
                await driver.get('https://stirling.she-development.net/automation');
            } catch (err) {
                'Error! ' + err
            }
        }),
            it('Login', async function () {
                try {
                    await driver.wait(until.elementLocated(By.id('username')));
                    await driver.findElement(By.id('username')).sendKeys(globals.loginDetails.username);
                    await driver.findElement(By.id('password')).sendKeys(globals.loginDetails.password);
                    await driver.findElement(By.id('login')).click()
                    await driver.wait(until.titleIs('Home'), 5000);
                } catch (err) {
                    'Error! ' + err;
                }
            }),
            it('Access Air Emissions From Dropdown', async function () {
                try {
                    const headers = await driver.findElements(By.className('headercenter'));
                    const modulesHeader = await headers[1];
                    const modulesDropdown = await modulesHeader.findElement(By.className('she-has-submenu'));
                    await modulesDropdown.click();
                    const environmentModule = await modulesDropdown.findElement(By.xpath('//li[@data-areaname="Environment"]'));
                    await driver.sleep(1000)
                    await driver.actions().move({ duration: 500, origin: environmentModule, x: 0, y: 0 }).perform();
                    await environmentModule.findElement(By.xpath('//a[@href="/automation/Environment/AirEmissions/Page/1"]')).click();
                    await driver.wait(until.titleIs('Air Emissions'), 5000);
                    const airEmissionUrl = await driver.getCurrentUrl();
                    assert.include(airEmissionUrl, '/Environment/AirEmissions/Page/', 'URL DOES NOT MATCH');
                } catch (err) {
                    'Error!' + err;
                }
            }),
            it('Click Create New Record Button', async function () {
                try {
                    await driver.findElement(By.className('create_record')).click();
                } catch (err) {
                    'Error!' + err;
                }
            }),
            it('Enter Description Text', async function () {
                try {
                    await driver.wait(until.elementLocated(By.id('SheAirEmissions_Description')));
                    await driver.findElement(By.id('SheAirEmissions_Description')).sendKeys(globals.variables.descriptionText)
                } catch (err) {
                    'Error! ' + err;
                }
            }),
            it('Select Todays Date', async function () {
                try {
                    const datepicker = await driver.findElement(By.className('ui-datepicker-trigger'));
                    await driver.executeScript("arguments[0].scrollIntoView(true);", datepicker);
                    await datepicker.click();
                    await driver.findElement(By.className('ui-state-highlight')).click();
                } catch (err) {
                    'Error! ' + err;
                }
            }),
            it('Click Save and Close button', async function () {
                try {
                    const saveButtons = await driver.findElements(By.xpath('//button[@name="submitButton"]'));
                    await saveButtons[1].click();
                    await driver.wait(until.elementLocated(By.className('create_record')));
                } catch (err) {
                    'Error! ' + err;
                }
            }),
            it('Verify Record Has Been Created', async function () {
                try {
                    const allRecords = await driver.findElements(By.className('list_layout StatusBars'));
                    var i;
                    for (i = 0; i < allRecords.length; i++) {
                        const recordText = await allRecords[i].getText();
                        if (recordText.includes(globals.variables.descriptionText)) {
                            break;
                        }
                    };

                    globals.variables.createdRecord = allRecords[i];
                } catch (err) {
                    'Error! ' + err;
                }
            }),
            it('Open Cog Dropdown', async function () {
                try {
                    await driver.executeScript("arguments[0].scrollIntoView(true);", globals.variables.createdRecord);
                    globals.variables.dropdownMenu = await globals.variables.createdRecord.findElement(By.className('btn-group'));
                    const cogDropdown = await globals.variables.dropdownMenu.findElement(By.className('fa-cog'));
                    await cogDropdown.click();
                } catch (err) {
                    'Error! ' + err;
                }
            }),
            it('Click Delete', async function () {
                try {
                    await globals.variables.dropdownMenu.findElement(By.className('deleteDialog')).click();
                } catch (err) {
                    'Error! ' + err;
                }
            }),
            it('Click Confirm Record Deletion', async function () {
                try {
                    await driver.wait(until.elementLocated(By.className('ui-dialog-buttonset')));
                    const popUpButtonset = await driver.findElement(By.className('ui-dialog-buttonset'));
                    const allPopUpButtons = await popUpButtonset.findElements(By.className('ui-button'));
                    await allPopUpButtons[0].click();
                } catch (err) {
                    'Error! ' + err;
                }
            }),
            it('Verify record has been deleted', async function() {
                try {
                    const allRecords = await driver.findElements(By.className('list_layout StatusBars'));
                    var i;
                    for (i = 0; i < allRecords.length; i++) {
                        const recordText = await allRecords[i].getText();
                        if (recordText.includes(globals.variables.descriptionText)) {
                            error('RECORD STILL AVAILABLE')
                        }
                    };
                } catch (err) {
                    'Error! ' + err;
                }
            }),
            after(async function() {
                await driver.quit();
            })
    })
})