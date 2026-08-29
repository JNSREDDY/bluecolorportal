/**
 * AI module placeholders — keep integrations isolated.
 * Do not call external AI APIs from controllers.
 */
class AiService {
  async resumeBuilder(_workerProfile) {
    return { status: 'not_implemented', feature: 'AI Resume Builder' };
  }

  async recommendCandidates(_jobId) {
    return { status: 'not_implemented', feature: 'AI Candidate Recommendation' };
  }

  async recommendJobs(_workerId) {
    return { status: 'not_implemented', feature: 'AI Job Recommendation' };
  }

  async chatbot(_message, _context) {
    return { status: 'not_implemented', feature: 'AI Chatbot' };
  }

  async skillGap(_workerId, _jobId) {
    return { status: 'not_implemented', feature: 'AI Skill Gap Analysis' };
  }
}

module.exports = new AiService();
