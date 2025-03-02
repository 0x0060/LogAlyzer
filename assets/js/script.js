document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const dropArea = document.getElementById("drop-area")
    const fileInput = document.getElementById("file-input")
    const browseBtn = document.getElementById("browse-btn")
    const uploadSection = document.getElementById("upload-section")
    const resultsSection = document.getElementById("results-section")
    const backBtn = document.getElementById("back-btn")
    const downloadBtn = document.getElementById("download-btn")
    const logOutput = document.getElementById("log-output")
    const fileName = document.getElementById("file-name")
    const loading = document.getElementById("loading")
    const tabButtons = document.querySelectorAll(".tab-button")
    const customFilter = document.getElementById("custom-filter")
    const regexInput = document.getElementById("regex-input")
    const applyRegexBtn = document.getElementById("apply-regex")
    const themeToggleBtn = document.getElementById("theme-toggle-btn")
    const uploadNewBtn = document.getElementById("upload-new-btn")
  
    // Counters
    const errorCount = document.getElementById("error-count")
    const warningCount = document.getElementById("warning-count")
    const infoCount = document.getElementById("info-count")
    const debugCount = document.getElementById("debug-count")
  
    // Log storage
    let logData = {
      all: [],
      errors: [],
      warnings: [],
      info: [],
      debug: [],
      custom: [],
    }
  
    let currentFile = null
    let currentTab = "all"
  
    // Theme toggle
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark")
      updateThemeIcon()
    })
  
    function updateThemeIcon() {
      const isDark = document.body.classList.contains("dark")
      themeToggleBtn.innerHTML = isDark
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>'
    }
  
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark")
      updateThemeIcon()
    }
  
    // File upload handling
    browseBtn.addEventListener("click", () => {
      fileInput.click()
    })
  
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handleFile(e.target.files[0])
      }
    })
  
    // Drag and drop handling
    ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })
  
    function preventDefaults(e) {
      e.preventDefault()
      e.stopPropagation()
    }
    ;["dragenter", "dragover"].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false)
    })
    ;["dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, unhighlight, false)
    })
  
    function highlight() {
      dropArea.classList.add("drag-over")
    }
  
    function unhighlight() {
      dropArea.classList.remove("drag-over")
    }
  
    dropArea.addEventListener("drop", (e) => {
      const dt = e.dataTransfer
      const file = dt.files[0]
      handleFile(file)
    })
  
    // File processing
    function handleFile(file) {
      currentFile = file
      fileName.textContent = file.name
  
      // Show loading state
      uploadSection.classList.add("hidden")
      resultsSection.classList.remove("hidden")
      loading.classList.remove("hidden")
  
      // Reset log data
      logData = {
        all: [],
        errors: [],
        warnings: [],
        info: [],
        debug: [],
        custom: [],
      }
  
      // Reset counters
      errorCount.textContent = "0"
      warningCount.textContent = "0"
      infoCount.textContent = "0"
      debugCount.textContent = "0"
  
      // Read and process the file
      setTimeout(() => {
        const reader = new FileReader()
  
        reader.onload = (e) => {
          const content = e.target.result
          processLogFile(content)
          loading.classList.add("hidden")
        }
  
        reader.onerror = () => {
          alert("Error reading file")
          loading.classList.add("hidden")
        }
  
        reader.readAsText(file)
      }, 500) // Small delay to show loading animation
    }
  
    function processLogFile(content) {
      // Split content into lines
      const lines = content.split(/\r?\n/)
  
      // Define regex patterns for different log levels
      const patterns = {
        error:
          /\b(ERR(?:OR)?|SEVERE|SEV|CRIT(?:ICAL)?|FATAL|EMERG(?:ENCY)?|ALERT|EXCEPTION|FAIL(?:ED)?|ERR\b|[Ee]rror:|❌|🔴)\b/i,
        warning: /\b(WARN(?:ING)?|ATTENTION|WRN|ALERT|CAUTION|NOTICE|⚠️|🟡)\b/i,
        info: /\b(INFO(?:RMATION)?|NOTICE|INF|NFO|NOTE|MESSAGE|MSG|✨|ℹ️|🔵)\b/i,
        debug: /\b(DEBUG|DBG|TRACE|TRC|VERBOSE|DETAIL|DIAG(?:NOSTIC)?|DEV|FINE|🐛)\b/i,
      }
  
      // Additional log format patterns
      const logFormatPatterns = {
        // Common log prefixes
        prefix: /^\[?([A-Z]{2,5})\]?[:|\s]/i, // Matches [ERR], [INFO], etc.
  
        // Common timestamp formats
        timestamps: [
          /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[+-]\d{2}:?\d{2}|Z)?/, // ISO8601
          /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}(?:\.\d+)?/, // YYYY-MM-DD HH:mm:ss
          /\d{2}[-/]\d{2}[-/]\d{4}\s\d{2}:\d{2}:\d{2}/, // DD-MM-YYYY HH:mm:ss
          /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}/, // Syslog
          /\d{2}:\d{2}:\d{2}(?:\.\d+)?/, // Time only
        ],
  
        // Log level variations with brackets, parentheses, etc
        levelFormats: [
          /\[(ERROR|ERR|SEVERE|SEV|CRIT|FATAL|WARN|INFO|INF|DEBUG|DBG|TRACE)\]/i,
          /$$(ERROR|ERR|SEVERE|SEV|CRIT|FATAL|WARN|INFO|INF|DEBUG|DBG|TRACE)$$/i,
          /ERROR:|WARNING:|INFO:|DEBUG:/i,
        ],
  
        // Process/Thread IDs
        processThread: [
          /\[(\d+)\]/, // [1234]
          /$$(\d+)$$/, // (1234)
          /pid:(\d+)/, // pid:1234
          /tid:(\d+)/, // tid:1234
        ],
  
        // Component/Module names
        component: [
          /\[([a-zA-Z][\w-]+(?:\.[a-zA-Z][\w-]+)*)\]/, // [component.subcomponent]
          /$$([a-zA-Z][\w-]+(?:\.[a-zA-Z][\w-]+)*)$$/, // (component.subcomponent)
        ],
      }
  
      // Process each line
      lines.forEach((line, index) => {
        if (!line.trim()) return // Skip empty lines
  
        const lineNumber = index + 1
        const lineObj = {
          number: lineNumber,
          text: line,
          type: "unknown",
          metadata: {},
        }
  
        // Extract timestamp
        for (const pattern of logFormatPatterns.timestamps) {
          const match = line.match(pattern)
          if (match) {
            lineObj.metadata.timestamp = match[0]
            break
          }
        }
  
        // Extract process/thread IDs
        for (const pattern of logFormatPatterns.processThread) {
          const match = line.match(pattern)
          if (match) {
            lineObj.metadata.processId = match[1]
            break
          }
        }
  
        // Extract component/module
        for (const pattern of logFormatPatterns.component) {
          const match = line.match(pattern)
          if (match) {
            lineObj.metadata.component = match[1]
            break
          }
        }
  
        // Check for prefix-style log levels
        const prefixMatch = line.match(logFormatPatterns.prefix)
        if (prefixMatch) {
          const prefix = prefixMatch[1].toUpperCase()
          if (/^(ERR|SEV|CRIT|FATAL)$/.test(prefix)) lineObj.type = "error"
          else if (/^(WARN|WRN|ATTN)$/.test(prefix)) lineObj.type = "warning"
          else if (/^(INF|NFO|MSG)$/.test(prefix)) lineObj.type = "info"
          else if (/^(DBG|TRC|VERB)$/.test(prefix)) lineObj.type = "debug"
        }
  
        // If no prefix match, check full patterns
        if (lineObj.type === "unknown") {
          if (patterns.error.test(line)) {
            lineObj.type = "error"
            logData.errors.push(lineObj)
          } else if (patterns.warning.test(line)) {
            lineObj.type = "warning"
            logData.warnings.push(lineObj)
          } else if (patterns.info.test(line)) {
            lineObj.type = "info"
            logData.info.push(lineObj)
          } else if (patterns.debug.test(line)) {
            lineObj.type = "debug"
            logData.debug.push(lineObj)
          }
        } else {
          // Add to appropriate array based on type from prefix
          logData[lineObj.type + "s"].push(lineObj)
        }
  
        logData.all.push(lineObj)
      })
  
      // Update counters
      errorCount.textContent = logData.errors.length
      warningCount.textContent = logData.warnings.length
      infoCount.textContent = logData.info.length
      debugCount.textContent = logData.debug.length
  
      // Display logs
      displayLogs(currentTab)
    }
  
    function displayLogs(tabName) {
      logOutput.innerHTML = ""
  
      if (!logData[tabName] || logData[tabName].length === 0) {
        logOutput.innerHTML = '<div class="log-line">No matching logs found.</div>'
        return
      }
  
      const fragment = document.createDocumentFragment()
  
      logData[tabName].forEach((log) => {
        const logLine = document.createElement("div")
        logLine.className = `log-line ${log.type}`
  
        // Format metadata if available
        let metadata = ""
        if (log.metadata.timestamp) metadata += `[${log.metadata.timestamp}] `
        if (log.metadata.processId) metadata += `[PID:${log.metadata.processId}] `
        if (log.metadata.component) metadata += `[${log.metadata.component}] `
  
        logLine.textContent = `[${log.number}] ${metadata}${log.text}`
        fragment.appendChild(logLine)
      })
  
      logOutput.appendChild(fragment)
    }
  
    // Tab handling
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabName = button.getAttribute("data-tab")
  
        // Update active tab
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")
  
        // Show/hide custom filter
        if (tabName === "custom") {
          customFilter.classList.remove("hidden")
        } else {
          customFilter.classList.add("hidden")
          currentTab = tabName
          displayLogs(tabName)
        }
      })
    })
  
    // Custom regex filter
    applyRegexBtn.addEventListener("click", () => {
      const regexPattern = regexInput.value.trim()
  
      if (!regexPattern) {
        alert("Please enter a valid regex pattern")
        return
      }
  
      try {
        const regex = new RegExp(regexPattern, "i")
  
        // Filter logs based on regex
        logData.custom = logData.all.filter((log) => regex.test(log.text))
  
        currentTab = "custom"
        displayLogs("custom")
      } catch (error) {
        alert("Invalid regex pattern: " + error.message)
      }
    })
  
    // Back button
    //backBtn.addEventListener("click", () => { ... })
    uploadNewBtn.addEventListener("click", () => {
      uploadSection.classList.remove("hidden")
      resultsSection.classList.add("hidden")
      logOutput.innerHTML = ""
      fileInput.value = ""
    })
  
    // Download buttons
    const downloadTxtBtn = document.getElementById("download-txt-btn")
    const downloadCsvBtn = document.getElementById("download-csv-btn")
  
    // Download as TXT
    downloadTxtBtn.addEventListener("click", () => {
      if (!currentFile) return
  
      let content = ""
  
      // Add summary
      content += `Log Analysis Results for: ${currentFile.name}\n`
      content += `Generated on: ${new Date().toLocaleString()}\n\n`
      content += `Summary:\n`
      content += `- Errors: ${logData.errors.length}\n`
      content += `- Warnings: ${logData.warnings.length}\n`
      content += `- Info: ${logData.info.length}\n`
      content += `- Debug: ${logData.debug.length}\n\n`
  
      // Add current tab logs
      content += `${currentTab.toUpperCase()} LOGS:\n\n`
  
      logData[currentTab].forEach((log) => {
        // Format metadata if available
        let metadata = ""
        if (log.metadata.timestamp) metadata += `[${log.metadata.timestamp}] `
        if (log.metadata.processId) metadata += `[PID:${log.metadata.processId}] `
        if (log.metadata.component) metadata += `[${log.metadata.component}] `
  
        content += `[${log.number}] ${metadata}${log.text}\n`
      })
  
      downloadFile(content, `analysis_${currentFile.name}.txt`, "text/plain")
    })
  
    // Download as CSV
    downloadCsvBtn.addEventListener("click", () => {
      if (!currentFile) return
  
      // Create CSV content
      let csvContent = "Line Number,Timestamp,Process ID,Component,Type,Message\n"
  
      logData[currentTab].forEach((log) => {
        const fields = [
          log.number,
          log.metadata.timestamp || "",
          log.metadata.processId || "",
          log.metadata.component || "",
          log.type,
          // Escape quotes and remove newlines from the message
          log.text
            .replace(/"/g, '""')
            .replace(/\n/g, " "),
        ]
  
        // Properly quote and join fields
        csvContent += fields.map((field) => `"${field}"`).join(",") + "\n"
      })
  
      downloadFile(csvContent, `analysis_${currentFile.name}.csv`, "text/csv")
    })
  
    // Generic download function
    function downloadFile(content, filename, type) {
      const blob = new Blob([content], { type })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
  
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
  
      setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 0)
    }
  
    // Advanced log parsing features
    function enhanceLogParsing() {
      // Common timestamp patterns
      const timestampPatterns = [
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)?/, // ISO format
        /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/, // Standard datetime
        /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/, // MM/DD/YYYY format
        /\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4}/, // Log format like "Mon Jan 01 12:00:00 2023"
      ]
  
      // Extract additional metadata from logs
      function extractMetadata(line) {
        const metadata = {}
  
        // Try to extract timestamp
        for (const pattern of timestampPatterns) {
          const match = line.match(pattern)
          if (match) {
            metadata.timestamp = match[0]
            break
          }
        }
  
        // Try to extract log level if not already determined
        const levelMatch = line.match(/\[(INFO|DEBUG|WARN(?:ING)?|ERROR|TRACE|FATAL)\]/i)
        if (levelMatch) {
          metadata.level = levelMatch[1].toLowerCase()
        }
  
        // Try to extract component/class name
        const componentMatch = line.match(/\[([a-zA-Z0-9._$]+)\]/)
        if (componentMatch) {
          metadata.component = componentMatch[1]
        }
  
        return metadata
      }
  
      // Enhance log parsing with metadata extraction
      window.enhancedParsing = (content) => {
        const lines = content.split(/\r?\n/)
        const enhancedLogs = []
  
        lines.forEach((line, index) => {
          if (!line.trim()) return
  
          const metadata = extractMetadata(line)
          enhancedLogs.push({
            number: index + 1,
            text: line,
            ...metadata,
          })
        })
  
        return enhancedLogs
      }
    }
  
    // Initialize advanced features
    enhanceLogParsing()
  })
  
  