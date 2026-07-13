import { useEffect, useState } from 'react';
import { Plus, Download, Trash2, QrCode, Copy, Check, Printer } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageQRCodes() {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [title, setTitle] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const fetchQRCodes = async () => {
    try {
      const { data } = await API.get('/qrcode');
      setQrCodes(data);
    } catch (err) {
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQRCodes(); }, []);

  const generateQR = async () => {
    setGenerating(true);
    try {
      await API.post('/qrcode/generate', { title: title || 'Menu QR Code' });
      toast.success('QR Code generated!');
      setTitle('');
      fetchQRCodes();
    } catch (err) {
      toast.error('Failed to generate QR');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this QR code?')) return;
    try {
      await API.delete(`/qrcode/${id}`);
      toast.success('QR Code deleted');
      fetchQRCodes();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const downloadQR = (qrImage, title) => {
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `${title.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('URL copied!');
  };

  const printQR = (qrImage, title) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Popup blocker prevented printing. Please allow popups.');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - ${title}</title>
          <style>
            body { font-family: sans-serif; text-align: center; margin-top: 50px; }
            img { width: 300px; height: 300px; border: 1px solid #eee; padding: 10px; border-radius: 12px; }
            h1 { font-size: 28px; margin: 15px 0 5px 0; }
            p { font-size: 16px; color: #555; }
          </style>
        </head>
        <body>
          <img src="${qrImage}" />
          <h1>${title}</h1>
          <p>Scan to see our Smart Menu</p>
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) return <div className="animate-pulse space-y-4">{[1, 2].map(i => <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">QR Codes</h1>
          <p className="text-gray-500">{qrCodes.length} codes generated</p>
        </div>
      </div>

      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Generate New QR Code</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Table Number or Name (e.g. Table 5)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field flex-1"
          />
          <button onClick={generateQR} disabled={generating} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-5 h-5" />
            {generating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {qrCodes.length === 0 ? (
        <div className="text-center py-20">
          <QrCode className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-xl">No QR codes yet</p>
          <p className="text-gray-400">Generate your first QR code above</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <div key={qr._id} className="card p-6 text-center group">
              <img src={qr.qrImage} alt={qr.title} className="w-48 h-48 mx-auto mb-4" />
              <h3 className="font-semibold mb-1">{qr.title}</h3>
              <p className="text-xs text-gray-400 mb-4 truncate">{qr.menuUrl}</p>
              <div className="flex justify-center gap-2">
                <button onClick={() => downloadQR(qr.qrImage, qr.title)} className="btn-outline text-sm py-1 px-3 flex items-center gap-1" title="Download Image">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={() => copyUrl(qr.menuUrl, qr._id)} className="btn-outline text-sm py-1 px-3 flex items-center gap-1" title="Copy URL">
                  {copiedId === qr._id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={() => printQR(qr.qrImage, qr.title)} className="btn-outline text-sm py-1 px-3 flex items-center gap-1" title="Print QR Code">
                  <Printer className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(qr._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
