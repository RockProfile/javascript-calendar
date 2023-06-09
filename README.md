# javascript-calendar

## Importable Items

### Days

An enum of the days of the week providing a translation of the name of the day and the id Date assigns it.

### Days_Short

An enum providing mapping between the ID Date provides a day and a 3 letter string for the day.

### Months_Short

An enum providing mapping between the ID Date provides a month and a 3 letter string for the month.

### Calendar

This is the main Calendar object.

## Public Methods

### constructor

| Parameter       | Type   | Description                                                                |
|-----------------|--------|----------------------------------------------------------------------------|
| selector        | String | The ID or class assigned to the dom object that will contain the calendar. |
| week_starts     | Days   | Identifies the day that to be used as the first day of the week.           |                                                                          |
| previous_symbol | String | The symbol to use in the navigation to go back a month.                    |                                                         |
| next_symbol     | String | The symbol to use in the navigation to go forward a month.                 |

### disable_days

Provides the ability to stop days being selectable.

| Parameter | Type     | Description                |
|-----------|----------|----------------------------|
| days      | number[] | A list of days to disable. |

### next_month

next_month does not accept any parameters. The method will trigger the calendar to switch to the next month.

### previous_month

previous_month does not accept any parameters. The method will trigger the calendar to switch to the previous month.

## Events

The following events are triggered on the dom provided from the selector.

| Name          | Data | Description                                |
|---------------|------|--------------------------------------------|
| day_changed   | Date | Triggered when the selected date changes.  |
| month_changed | Date | Triggered when the selected month changes. |

## CSS

| Name         | Type  | Description                                                                         |
|--------------|-------|-------------------------------------------------------------------------------------|
| cal_table    | class | Applied to the container table.                                                     |
| cal_nav      | class | Applied to the navigation of the calendar.                                          |
| cal_title    | id    | Applied to the column containing the calendar title in the thead row.               |
| cal_body     | id    | Applied to the tbody of the calendar containing the day header row and weekly rows. |
| cal_days     | class | Applied to the header showing the names of the days of the week.                    |
| cal_week     | class | Applied to each row containing a weeks worth of days.                               |
| day_{1-31}   | id    | Applied to each individual td that contains a valid day.                            |
| cal_active   | class | Applied to td that have not been set to inactive as well as the navigation links.   |
| cal_inactive | class | Applied to td that have been set to inactive.                                       |
| cal_selected | class | Applied to the day currently selected.                                              |

## Examples

A basic example can be found [HERE](examples/index.html).
