/**
 * Anti-Telemetry & Anti-Tracking Rule
 * Detects hidden tracking beacons, forced telemetry, or data exfiltration attempts.
 */
module.exports = {
  id: 'anti-telemetry',
  name: 'Security Anti-Tracking Guard',
  description: 'Prevents unauthorized data tracking, hidden telemetry pings, and tracking beacons.',
  run: (content, context) => {
    const errors = [];
    const warnings = [];
    
    // Pattern: Hidden tracking beacons (tiny 1x1 pixels or tracking IDs)
    const trackingBeaconRegex = /https?:\/\/.*\/pixel\.gif|https?:\/\/.*\/track\?id=|utm_source=/gi;
    
    // Pattern: Forced telemetry that cannot be disabled
    const forcedTelemetryRegex = /sendTelemetry\(.*\)|reportUsage\(.*\)/gi;
    
    // Pattern: Unauthorized reporting to unknown security domains
    const suspiciousReportRegex = /fetch\(.*['"]https?:\/\/(track|api|telemetry)\.[^.]+['"]\)/gi;

    if (trackingBeaconRegex.test(content)) {
      errors.push({
        message: 'CRITICAL: Tracking Beacon Detected. Potential privacy leak through 1x1 pixel or tracking parameters.',
      });
    }

    if (forcedTelemetryRegex.test(content) && !content.includes('enableTelemetry')) {
      warnings.push({
        message: 'Privacy Warning: Forced telemetry detected without an explicit opt-in/opt-out check.',
      });
    }

    if (suspiciousReportRegex.test(content) && !content.includes('moltbook.com')) {
      errors.push({
        message: 'Security Risk: Unauthorized data reporting to external tracking domain identified.',
      });
    }

    return { errors, warnings };
  }
};
