"use strict";

/**
 * Enum for days of the week.
 *
 * @type {{Monday: number, Thursday: number, Friday: number, Sunday: number, Wednesday: number, Tuesday: number, Saturday: number}}
 */
export const Days = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
}

/**
 * Enum for the short names of days using index obtained from Days.
 *
 * @type {{"0": string, "1": string, "2": string, "3": string, "4": string, "5": string, "6": string}}
 */
export const Days_Short = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
}

/**
 * Enum for the short names of months using index obtained from Months.
 */
export const Months_Short = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
}

/**
 * Interface for event payloads.
 */
interface iEventPayload {
    date: Date,
}

/**
 * Function to use as an event handler for when days are clicked.
 *
 * @param event The event causing the trigger.
 */
function day_event(event: PointerEvent){
    this._date_selected_event_listener(event);
}

/**
 * Calendar class
 */
export class Calendar {
    _cal_date: number;
    _cal_element: HTMLElement;
    _cal_month: number;
    _cal_year: number;
    _event_handler;
    _next_symbol;
    _previous_symbol;
    _week_starts: number;

    /**
     * Constructor.
     *
     * @param selector ID or class of the element to contain the calendar. Must begin with . or #.
     * @param week_starts The id for the first day of the week.
     * @param previous_symbol Symbol to use for the previous month link.
     * @param next_symbol Symbol to use for the next month link.
     */
    constructor({
                    selector = '#calendar',
                    week_starts = Days.Monday,
                    previous_symbol = '&lt;',
                    next_symbol = '&gt;',
    } = {}) {
        this._cal_element =  document.querySelector(selector);
        this._event_handler = day_event.bind(this);
        this._next_symbol = next_symbol;
        this._previous_symbol = previous_symbol;
        this._week_starts = week_starts;

        const today: Date = new Date();
        this._cal_date = today.getDate();
        this._cal_month = today.getMonth();
        this._cal_year = today.getFullYear();

        this._build_calendar();
    }

    /**
     * Disable days from being clickable.
     *
     * @param days List of days as a number.
     */
    disable_days(days: number[])
    {
        days.forEach((day) => {
            let day_id: string = 'day_' + day.toString();
            let day_item: HTMLElement = document.getElementById(day_id);
            day_item.classList.remove('cal_active');
            day_item.classList.add('cal_inactive');
            day_item.removeEventListener("click", this._event_handler, true);
        })
    }

    /**
     * Moves the current month forward by one.
     */
    next_month(): Date{
        this._cal_date = 1;
        this._cal_month++;
        if(this._cal_month > 11){
            this._cal_month = 0;
            this._cal_year++;
        }
        this._output_weeks();
        this._select_date(1);

        let payload: iEventPayload = {
            'date': new Date(this._cal_year, this._cal_month, this._cal_date),
        }
        this._trigger_event('month_changed', payload)
        return new Date(this._cal_year, this._cal_month, this._cal_date)
    }

    /**
     * Moves the current month back by one.
     */
    previous_month(): Date{
        this._cal_date = 1;
        this._cal_month--;
        if (this._cal_month < 0){
            this._cal_month = 11;
            this._cal_year--;
        }
        this._output_weeks();
        this._select_date(1);

        let payload: iEventPayload = {
            'date': new Date(this._cal_year, this._cal_month, this._cal_date),
        }
        this._trigger_event('month_changed', payload)
        return new Date(this._cal_year, this._cal_month, this._cal_date)
    }

    /**
     * Build and output the calendar.
     */
    _build_calendar(){
        this._build_calendar_frame();
        this._output_weeks();
        const today_date: Date = new Date();
        this._select_date(today_date.getDate());
    }

    /**
     * Build the structure of the calendar.
     */
    _build_calendar_frame(){
        let table: HTMLElement = document.createElement('table');
        table.classList.add('cal_table');
        this._cal_element.replaceChildren(table);

        let thead: HTMLElement = document.createElement('thead');
        table.appendChild(thead);

        let thead_tr: HTMLElement = document.createElement('tr');
        thead.appendChild(thead_tr);

        thead_tr.appendChild(this._build_header_th({
            content: this._previous_symbol,
            active: true,
            listener: function(){this.previous_month()}.bind(this),
        }));
        thead_tr.appendChild(this._build_header_th({
            content: this._build_header_title(),
            colspan: 5,
        }))
        thead_tr.appendChild(this._build_header_th({
            content: this._next_symbol,
            active: true,
            listener: function(){this.next_month()}.bind(this),
        }));

        let tbody: HTMLElement = document.createElement('tbody');
        tbody.setAttribute('id', 'cal_body');
        table.appendChild(tbody);
    }

    /**
     * Build and output the day's header.
     *
     * @param container Container for the calendar body.
     */
    _build_day_header(container: HTMLElement){
        let tr: HTMLElement = document.createElement('tr');
        for (let i: number = 0; i < 7; i++) {
            let day: number = (this._week_starts + i) % 7
            let td: HTMLElement = document.createElement('td');
            td.innerHTML = Days_Short[day]
            tr.appendChild(td);
        }
        container.appendChild(tr);
    }

    /**
     * Build individual thead td cell.
     *
     * @param content Text content of the new td.
     * @param active True if the mouse icon should treat as a link otherwise false.
     * @param colspan The colspan for the td.
     * @param listener Listener for events.
     */
    _build_header_th({
                         content = '',
                         active = false,
                         colspan = 1,
                         listener = null
    } = {})
    {
        let th: HTMLElement = document.createElement('th');
        th.innerHTML = content;
        if (colspan > 1){
            th.setAttribute('colspan', colspan.toString())
            th.setAttribute('id', 'cal_title')
        }

        if (active){
            th.classList.add('cal_active');
        }

        if (listener !== null){
            th.addEventListener('click', listener)
        }

        return th
    }

    /**
     * Construct the title of the calendar.
     */
    _build_header_title(): string{
        return Months_Short[this._cal_month] + ' - ' + this._cal_year;
    }

    /**
     * Build each week and attach it to the calendar.
     *
     * @param container Element that will contain the weeks,
     */
    _build_weeks(container: HTMLElement){
        const days_in_month: number = this._days_in_month(this._cal_month, this._cal_year);
        const month_first_day: number = new Date(this._cal_year, this._cal_month, 1).getDay();
        let blank_days: number;
        if (month_first_day >= this._week_starts){
            blank_days = month_first_day - this._week_starts;
        }
        else{
            blank_days = ((7 - this._week_starts) + month_first_day) % 7;
        }

        let tr: HTMLElement = document.createElement('tr');
        container.appendChild(tr);
        for (let di: number = 0; di < blank_days; di++){
            let td: HTMLElement = document.createElement('td');
            td.innerHTML = '&nbsp;';
            tr.appendChild(td);
        }

        let iter: number = 1;
        while (iter <= days_in_month){
            if ((iter + blank_days) % 7 === 1) {
                tr = document.createElement('tr');
                container.appendChild(tr);
            }

            let td: HTMLElement = document.createElement('td');
            td.innerHTML = iter.toString();
            td.addEventListener("click", this._event_handler, true);
            td.setAttribute('id', 'day_' + iter);
            td.classList.add('cal_active');
            tr.appendChild(td);
            iter++;
        }
    }

    /**
     * Listener for when a date is selected.
     *
     * @param event Element that triggered the event.
     */
    _date_selected_event_listener(event: PointerEvent){
        let target: HTMLElement = <HTMLElement>event.target;
        this._cal_date = parseInt(target.innerHTML)
        this._select_date(this._cal_date);
    }

    /**
     * Calculate the number of days in a month.
     *
     * @param month the month to fetch the number of days for.
     * @param year The year the month is in.
     */
    _days_in_month(month: number, year: number): number{
        const last_day: Date = new Date(year, month + 1, 0)
        return last_day.getDate()
    }

    /**
     * Set up the creation of the days.
     */
    _output_weeks(){
        let tbody: HTMLElement = document.getElementById('cal_body');
        let title: HTMLElement = document.getElementById('cal_title');
        title.innerHTML = this._build_header_title();
        tbody.replaceChildren();
        this._build_day_header(tbody);
        this._build_weeks(tbody);
    }

    /**
     * Mark the supplied date as selected.
     *
     * @param date to be selected.
     */
    _select_date(date: number){
        let current_selected: HTMLCollectionOf<Element> = document.getElementsByClassName('cal_selected');
        for (let current of current_selected){
            current.classList.remove('cal_selected');
        }

        const date_id = 'day_' + date.toString()
        let new_selected: HTMLElement = document.getElementById(date_id);
        new_selected.classList.add('cal_selected');

        let payload: iEventPayload = {
            'date': new Date(this._cal_year, this._cal_month, this._cal_date),
        }
        this._trigger_event('day_changed', payload)
    }

    /**
     * Trigger an event with the given name and payload.
     *
     * @param name Name of the event.
     * @param payload Payload to add to details.
     */
    _trigger_event(name: string, payload: iEventPayload){
        const event: CustomEvent = new CustomEvent(name, {
            detail: payload,
            bubbles: false,
            cancelable: true,
            composed: false,
        });
        this._cal_element.dispatchEvent(event)
    }
}
