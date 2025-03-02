# LogAlyzer

![486_3x_shots_so](https://github.com/user-attachments/assets/0a44c2d7-bc69-452b-8878-57e2c02bdee7)

## Overview

LogAlyzer is a sophisticated log analysis tool designed to streamline the process of analyzing and interpreting log files. It offers an intuitive web interface with powerful features for parsing, filtering, and exporting log data in various formats.

## Features

- **Real-time Log Analysis**: Instant parsing and categorization of log entries
- **Multiple Log Level Support**: Automatic detection and filtering of Error, Warning, Info, and Debug levels
- **Advanced Filtering**: Custom regex-based filtering capabilities
- **Export Options**: Download analyzed logs in TXT and CSV formats
- **Dark/Light Theme**: Customizable UI theme for optimal viewing experience
- **Drag and Drop**: Intuitive file upload interface
- **Responsive Design**: Fully responsive interface that works across all devices

## Technical Requirements

- Modern web browser with JavaScript enabled
- Support for HTML5 File API
- Local development server for testing

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/0x0060/logalyzer.git
   cd logalyzer
   ```

2. Set up a local development server (e.g., using Python or open the index.html file directly):
   ```bash
   # Python 3.x
   python -m http.server 8000
   ```

## Usage

1. Access the application through your web browser at `http://localhost:8000` or open the index.html file directly.
2. Upload a log file using one of the following methods:
   - Drag and drop the file into the designated area
   - Click the "Browse Files" button to select a file
3. View the analyzed results in the following categories:
   - All Logs
   - Errors
   - Warnings
   - Info
   - Debug
4. Apply custom filters using the regex filter option
5. Export the results in TXT or CSV format

## Project Structure

```
logalyzer/
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── script.js
└── index.html
```

## API Documentation

### Log Entry Format

The application expects log entries in the following format:
```
[LEVEL] TIMESTAMP MESSAGE
```

Supported log levels:
- ERROR
- WARNING
- INFO
- DEBUG
- Different timestamp formats and different logging formats


Regex patterns for different log levels
```
const patterns = {
  error:
    /\b(ERR(?:OR)?|SEVERE|SEV|CRIT(?:ICAL)?|FATAL|EMERG(?:ENCY)?|ALERT|EXCEPTION|FAIL(?:ED)?|ERR\b|[Ee]rror:|❌|🔴)\b/i,
  warning: /\b(WARN(?:ING)?|ATTENTION|WRN|ALERT|CAUTION|NOTICE|⚠️|🟡)\b/i,
  info: /\b(INFO(?:RMATION)?|NOTICE|INF|NFO|NOTE|MESSAGE|MSG|✨|ℹ️|🔵)\b/i,
  debug: /\b(DEBUG|DBG|TRACE|TRC|VERBOSE|DETAIL|DIAG(?:NOSTIC)?|DEV|FINE|🐛)\b/i,
}
```

Common timestamp formats
```
timestamps: [
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[+-]\d{2}:?\d{2}|Z)?/, // ISO8601
  /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}(?:\.\d+)?/, // YYYY-MM-DD HH:mm:ss
  /\d{2}[-/]\d{2}[-/]\d{4}\s\d{2}:\d{2}:\d{2}/, // DD-MM-YYYY HH:mm:ss
  /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}/, // Syslog
  /\d{2}:\d{2}:\d{2}(?:\.\d+)?/, // Time only
],
```

Log level variations with brackets, parentheses, etc
```
levelFormats: [
  /\[(ERROR|ERR|SEVERE|SEV|CRIT|FATAL|WARN|INFO|INF|DEBUG|DBG|TRACE)\]/i,
  /$$(ERROR|ERR|SEVERE|SEV|CRIT|FATAL|WARN|INFO|INF|DEBUG|DBG|TRACE)$$/i,
  /ERROR:|WARNING:|INFO:|DEBUG:/i,
],
```

Process/Thread IDs
```
processThread: [
  /\[(\d+)\]/, // [1234]
  /$$(\d+)$$/, // (1234)
  /pid:(\d+)/, // pid:1234
  /tid:(\d+)/, // tid:1234
],
```

Component/Module names
```
component: [
  /\[([a-zA-Z][\w-]+(?:\.[a-zA-Z][\w-]+)*)\]/, // [component.subcomponent]
  /$$([a-zA-Z][\w-]+(?:\.[a-zA-Z][\w-]+)*)$$/, // (component.subcomponent)
],
```

### Export Formats

#### TXT Export
Preserves the original log format with added analysis markers.

#### CSV Export
Exports logs in the following column structure:
- Timestamp
- Level
- Message

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Building from Source

1. Clone the repository
2. Make necessary modifications to the source files
3. Test changes using a local development server

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security

This application processes log files locally in the browser. No data is transmitted to external servers.

## Performance

- Optimized for log files up to 10MB
- Real-time parsing and filtering
- Efficient memory management for large log files

## Support

For bug reports and feature requests, please use the GitHub issue tracker.
