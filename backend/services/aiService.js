const Sentiment = require('sentiment');
const keywordExtractor = require('keyword-extractor');

const sentimentAnalyzer = new Sentiment();

/**
 * Analyzes text to extract sentiment and keywords
 * @param {string} text - The input text (e.g. description)
 * @returns {object} { sentimentScore, keywords }
 */
const analyzeText = (text) => {
  if (!text) return { sentimentScore: 0, keywords: [] };

  // Sentiment Analysis
  const sentimentResult = sentimentAnalyzer.analyze(text);
  
  // Keyword Extraction
  const keywords = keywordExtractor.extract(text, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true
  });

  // Limit keywords to the top 5 for neatness
  const topKeywords = keywords.slice(0, 5);

  return {
    sentimentScore: sentimentResult.score,
    keywords: topKeywords
  };
};

module.exports = {
  analyzeText
};
