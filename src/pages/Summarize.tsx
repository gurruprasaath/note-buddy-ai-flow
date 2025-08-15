
import React, { useState } from 'react';
import { FileText, Sparkles, Copy, Download, Loader2, AlertCircle } from 'lucide-react';
import { useFiles } from '@/contexts/FileProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Summarize = () => {
  const { uploadedFiles, getFileContent } = useFiles();
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const { toast } = useToast();

  const generateSummary = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to summarize.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const sampleSummary = `Here's a concise summary of your text:

Key Points:
• ${inputText.split(' ').slice(0, 5).join(' ')}... represents the main concept
• Important themes and ideas have been identified and condensed
• Critical information has been preserved while removing redundant details
• The core message remains intact in this shortened format

Summary Length: ${Math.floor(inputText.length * 0.3)} characters (reduced from ${inputText.length} characters)

This AI-generated summary captures the essential information while making it easier to review and understand. In a real implementation, this would use the Groq API for more accurate and contextual summarization.`;

      setSummary(sampleSummary);
      setIsGenerating(false);
    }, 2500);
  };

  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
    const content = getFileContent(fileName);
    setInputText(content);
    toast({
      title: "File Selected",
      description: `Loaded content from ${fileName}`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    toast({
      title: "Copied!",
      description: "Summary copied to clipboard.",
    });
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Summary saved as summary.txt",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          <span className="bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">Summarize</span> Your Notes
        </h1>
        <p className="text-xl text-gray-600">
          Transform lengthy notes into concise, easy-to-understand summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Input Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadedFiles.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">Select a file uploaded in Chat:</p>
                  {uploadedFiles.map((file, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                        selectedFile === file.name 
                          ? 'bg-sky-100 border-sky-300' 
                          : 'bg-gray-50 border-gray-200 hover:border-sky-200'
                      }`}
                      onClick={() => handleFileSelect(file.name)}
                    >
                      <FileText className="h-5 w-5 text-sky-600 mr-2" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">No files available</p>
                  <p className="text-xs text-gray-500">
                    Go to the Chat page to upload files first
                  </p>
                </div>
              )}

              <div className="relative">
                <div className="absolute top-2 right-2 bg-sky-50 px-2 py-1 rounded text-xs text-sky-600">
                  {inputText.length} characters
                </div>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your notes or text here to get a concise summary..."
                  className="min-h-[300px] resize-none pr-20"
                />
              </div>

              <Button
                onClick={generateSummary}
                disabled={!inputText.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Summary
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  AI Summary
                </span>
                {summary && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadSummary}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-sky-500 mx-auto mb-4" />
                    <p className="text-gray-600">AI is analyzing your text...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                </div>
              ) : summary ? (
                <div className="bg-gradient-to-br from-sky-50 to-purple-50 p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-sans">
                    {summary}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">No summary yet</p>
                  <p className="text-sm">
                    Enter some text and click "Generate Summary" to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>💡 Tips for Better Summaries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-sky-50 rounded-lg">
              <h4 className="font-semibold text-sky-800 mb-2">Quality Input</h4>
              <p className="text-sky-700">
                Provide well-structured text with clear paragraphs for better AI understanding.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Optimal Length</h4>
              <p className="text-purple-700">
                Best results with 500-5000 characters. Very short texts may not need summarizing.
              </p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h4 className="font-semibold text-emerald-800 mb-2">Review & Edit</h4>
              <p className="text-emerald-700">
                Always review AI summaries and edit as needed for your specific learning needs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Summarize;
