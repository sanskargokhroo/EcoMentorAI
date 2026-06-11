import React, { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { analyzeProduct } from '../services/api';

const ProductScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    return () => {
      readerRef.current.reset();
    };
  }, []);

  const startScanner = async () => {
    setScanning(true);
    setError(null);
    try {
      const videoInputDevices = await readerRef.current.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        throw new Error("No camera found.");
      }
      
      const selectedDeviceId = videoInputDevices[0].deviceId;
      
      readerRef.current.decodeFromVideoDevice(selectedDeviceId, videoRef.current!, (result, err) => {
        if (result) {
          const code = result.getText();
          setBarcode(code);
          readerRef.current.reset();
          setScanning(false);
          fetchProductData(code);
        }
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to start camera.');
      setScanning(false);
    }
  };

  const fetchProductData = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      // Free Open Food Facts API
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const data = await res.json();
      
      if (data.status === 1 && data.product && data.product.product_name) {
        const name = data.product.product_name;
        const category = data.product.categories ? data.product.categories.split(',')[0] : 'Unknown';
        setProductInfo({ name, category });
        
        // Now get Gemini AI analysis
        const analysisRes = await analyzeProduct(name, category);
        setAiAnalysis(analysisRes.data);
      } else {
        throw new Error('Product not found in Open Food Facts database.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error looking up product.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setBarcode(null);
    setProductInfo(null);
    setAiAnalysis(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          📸 Product Scanner
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Scan any barcode. We'll use AI to estimate its carbon footprint and suggest an eco-friendly alternative!
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
        {!scanning && !barcode && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <button 
              onClick={startScanner}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:-translate-y-1"
            >
              Start Camera Scanner
            </button>
          </div>
        )}

        {scanning && (
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-4 border-green-500 opacity-50 m-8 rounded-xl border-dashed"></div>
            <button 
              onClick={() => { readerRef.current.reset(); setScanning(false); }}
              className="absolute bottom-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg"
            >
              Cancel
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Looking up product & consulting Gemini AI...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800/50 text-center">
            <p>{error}</p>
            <button onClick={reset} className="mt-4 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 px-4 py-2 rounded-lg font-bold">Try Again</button>
          </div>
        )}

        {aiAnalysis && productInfo && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-3xl">
                🛒
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{productInfo.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold tracking-wider">{productInfo.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-100 dark:border-orange-800/50">
                <h4 className="text-orange-800 dark:text-orange-400 font-bold mb-2 flex items-center">
                  <span className="mr-2">🔥</span> Carbon Footprint
                </h4>
                <p className="text-lg text-gray-800 dark:text-gray-200">{aiAnalysis.footprint}</p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800/50">
                <h4 className="text-green-800 dark:text-green-400 font-bold mb-2 flex items-center">
                  <span className="mr-2">🌱</span> Greener Alternative
                </h4>
                <p className="text-lg text-gray-800 dark:text-gray-200 font-bold mb-2">{aiAnalysis.alternative}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{aiAnalysis.reasoning}</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <button onClick={reset} className="text-green-600 dark:text-green-400 font-bold hover:underline">
                Scan Another Product
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductScanner;
