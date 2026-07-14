import { useState } from 'react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle, Play } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function BulkUploadModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Generating, 4: Summary
  const [previewData, setPreviewData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadSample = async () => {
    try {
      const response = await api.get('/certificates/bulk/sample', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Bulk_Certificate_Sample.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error('Failed to download sample file');
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/certificates/bulk/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPreviewData(res.data.data);
      setStep(2); // Move to preview
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload and validate file');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setStep(3); // Move to generating
    
    try {
      const res = await api.post('/certificates/bulk/generate', { rows: previewData });
      setSummary(res.data.data);
      setStep(4); // Move to summary
      onComplete(); // Refresh list behind the modal
    } catch (error) {
      toast.error(error.response?.data?.message || 'Generation failed');
      setStep(2); // Go back to preview
    }
  };

  const resetModal = () => {
    setStep(1);
    setFile(null);
    setPreviewData([]);
    setSummary(null);
    onClose();
  };

  const renderUploadStep = () => (
    <div className="space-y-6 text-center py-4">
      <div className="flex justify-center mb-6">
        <button 
          onClick={handleDownloadSample}
          className="flex items-center gap-2 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
        >
          <Download size={20} />
          Download Sample Excel
        </button>
      </div>

      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer relative bg-slate-50 dark:bg-slate-900/50">
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          onChange={handleFileUpload} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
            <Upload size={32} />
          </div>
          {loading ? (
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Validating file...</p>
          ) : (
            <>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Click to upload Excel or CSV file</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Max file size 10MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderPreviewStep = () => {
    const readyCount = previewData.filter(r => r.status === 'Ready').length;
    const errorCount = previewData.filter(r => r.status === 'Error').length;
    const dupCount = previewData.filter(r => r.status === 'Duplicate').length;

    return (
      <div className="space-y-6">
        <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="flex-1 text-center">
            <p className="text-sm text-slate-500">Ready to Generate</p>
            <p className="text-2xl font-bold text-green-600">{readyCount}</p>
          </div>
          <div className="flex-1 text-center border-l border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500">Errors</p>
            <p className="text-2xl font-bold text-red-600">{errorCount}</p>
          </div>
          <div className="flex-1 text-center border-l border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500">Duplicates</p>
            <p className="text-2xl font-bold text-yellow-600">{dupCount}</p>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-500">Row</th>
                <th className="px-4 py-3 font-medium text-slate-500">Student Name</th>
                <th className="px-4 py-3 font-medium text-slate-500">Regd No</th>
                <th className="px-4 py-3 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {previewData.map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">{row.rowNumber}</td>
                  <td className="px-4 py-3 font-medium">{row.studentName || '-'}</td>
                  <td className="px-4 py-3">{row.regdNo || '-'}</td>
                  <td className="px-4 py-3">
                    {row.status === 'Ready' && <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs"><CheckCircle size={14}/> Ready</span>}
                    {row.status === 'Error' && <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs" title={row.error}><AlertCircle size={14}/> {row.error}</span>}
                    {row.status === 'Duplicate' && <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs" title={row.error}><AlertCircle size={14}/> Duplicate</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button onClick={() => setStep(1)} className="px-6 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
            Upload Different File
          </button>
          <button 
            onClick={handleGenerate} 
            disabled={readyCount === 0}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <Play size={18} />
            Generate {readyCount} Certificates
          </button>
        </div>
      </div>
    );
  };

  const renderGeneratingStep = () => (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Generating Certificates...</h3>
        <p className="text-slate-500 dark:text-slate-400">This may take a few minutes depending on the batch size.</p>
        <p className="text-sm text-slate-400 mt-4">Please do not close this window.</p>
      </div>
    </div>
  );

  const renderSummaryStep = () => (
    <div className="space-y-8 text-center py-6">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-2">
        <CheckCircle size={40} />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Bulk Generation Complete!</h3>
        <p className="text-slate-500 dark:text-slate-400">Successfully generated {summary.generated} certificates.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div>
          <p className="text-sm text-slate-500 mb-1">Total Rows</p>
          <p className="text-xl font-bold text-slate-800 dark:text-white">{summary.totalRows}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 mb-1">Generated</p>
          <p className="text-xl font-bold text-green-600">{summary.generated}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 mb-1">Skipped</p>
          <p className="text-xl font-bold text-yellow-600">{summary.skipped}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 mb-1">Failed</p>
          <p className="text-xl font-bold text-red-600">{summary.failed}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {summary.zipUrl && (
          <a 
            href={`${import.meta.env.VITE_BACKEND_URL}${summary.zipUrl}`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg shadow-primary-500/30"
          >
            <Download size={20} />
            Download Certificates.zip
          </a>
        )}
        {summary.csvUrl && (
          <a 
            href={`${import.meta.env.VITE_BACKEND_URL}${summary.csvUrl}`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-medium"
          >
            <Download size={20} />
            Download Error Report
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Bulk Generate Certificates</h2>
              <p className="text-sm text-slate-500">
                {step === 1 && 'Upload Excel template'}
                {step === 2 && 'Preview and validate data'}
                {step === 3 && 'Processing batch...'}
                {step === 4 && 'Summary and download'}
              </p>
            </div>
          </div>
          {step !== 3 && (
            <button onClick={resetModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {step === 1 && renderUploadStep()}
          {step === 2 && renderPreviewStep()}
          {step === 3 && renderGeneratingStep()}
          {step === 4 && renderSummaryStep()}
        </div>
      </div>
    </div>
  );
}
