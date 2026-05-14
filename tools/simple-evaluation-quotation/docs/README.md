# Simple Evaluation Quotation Tool

Static browser tool for estimating video editing and illustration quotations.

## Structure

- `index.html` owns the tool document and custom header.
- `style.css` owns the tool-only visual system.
- `app.js` owns UI rendering, preset loading, pricing logic, import/export, URL type sync, and PNG export.
- `data/defaultData_[category]_[index].json` stores category presets.
- `design.md` records the tool-specific design direction.

## Preset Loading

The runtime attempts to load `defaultData_[category]_00.json`, `defaultData_[category]_01.json`, and so on from `data/`, stopping when the next file cannot be loaded.

Loaded presets appear in the header preset selector. Switching presets replaces the current configuration and resets controls to that preset's defaults.

Supported category query values:

- `?type=videoEditing`
- `?type=illustration`

If the query parameter is missing, the user selects a category in the startup modal.

Selecting a category from the startup modal updates the URL to the matching `?type=` value.
