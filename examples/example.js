import { Calendar } from "../src/calendar.js";
let cal;
window.document.querySelector('#calendar').addEventListener('day_changed', (event) => {
    console.log(event.detail);
});
window.document.querySelector('#calendar').addEventListener('month_changed', (event) => {
    console.log(event.detail);
    cal.disable_days([7,]);
});
cal = new Calendar({ 'selector': '#calendar' });
//# sourceMappingURL=example.js.map