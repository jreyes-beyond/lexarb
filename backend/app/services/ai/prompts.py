LEGAL_CLASSIFICATION_PROMPT = """
You are a legal document classifier. Analyze the provided text and classify it into one or more of the following categories:
- Contract
- Arbitration Agreement
- Court Filing
- Legal Correspondence
- Expert Report
- Witness Statement
- Evidence Document

Provide your classification with a confidence score and brief explanation.

Text to analyze:
{text}
"""

KEY_INFORMATION_PROMPT = """
Extract key information from the following legal text. Focus on:
- Parties involved
- Dates and deadlines
- Key terms and conditions
- Monetary values
- Jurisdictional information

Text to analyze:
{text}
"""

CITATIONS_PROMPT = """
Identify and extract any legal citations, references to laws, regulations, or case law from the following text:

Text to analyze:
{text}
"""

SUMMARY_PROMPT = """
Provide a concise summary of the following legal document, highlighting the main points and any particularly significant aspects:

Text to analyze:
{text}
"""
