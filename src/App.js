import React, { useState } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([
    { 
      id: 1, 
      type: 'straight',
      length: '', 
      width: '',
      length1: '',
      width1: '',
      length2: '',
      width2: '',
      lengthLeft: '',
      widthLeft: '',
      lengthCenter: '',
      widthCenter: '',
      lengthRight: '',
      widthRight: '',
      polishCorners: [],
      hasHob: false, 
      hobType: 'standard', 
      hasSink: false, 
      sinkType: 'overmount',
      sinkInstallType: 'overmount',
      hasReinforcement: false,
      hasExtras: false,
      extrasCount: 1,
      hasSeam: false,
      seamCount: 1,
      hasH40: false,
      hasSimpleBoard: false,
      boardLength: '',
      hasMeasurement: false,
      measurementType: 'standard',
      hasInstallation: false,
      hasDelivery: false,
      installationArea: ''
    }
  ]);
  const [nextId, setNextId] = useState(2);
  const [totalPrice, setTotalPrice] = useState(null);
  const [priceSettingsOpen, setPriceSettingsOpen] = useState(false);
  
  const [prices, setPrices] = useState({
    cutPerMeter: 10,
    polishPerMeter: 25,
    hobStandard: 35,
    hobFlush: 160,
    sinkOvermount: 35,
    sinkUndermount: 100,
    sinkRoundOval: 120,
    sinkInstallOvermount: 15,
    sinkInstallUndermount: 25,
    reinforcement: 20,
    extras: 10,
    seam: 50,
    measurementStandard: 35,
    measurementLarge: 50,
    installationStandard: 35,
    installationNarrow: 17,
    h40Percent: 35,
    simpleBoard: 40,
    deliveryUpTo2m: 30,
    deliveryOver2m: 60
  });

  const updatePrice = (key, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setPrices({ ...prices, [key]: numValue });
    } else if (value === '') {
      setPrices({ ...prices, [key]: '' });
    }
    setTotalPrice(null);
  };

  const addItem = () => {
    setItems([...items, { 
      id: nextId, 
      type: 'straight',
      length: '', 
      width: '',
      length1: '',
      width1: '',
      length2: '',
      width2: '',
      lengthLeft: '',
      widthLeft: '',
      lengthCenter: '',
      widthCenter: '',
      lengthRight: '',
      widthRight: '',
      polishCorners: [],
      hasHob: false,
      hobType: 'standard',
      hasSink: false,
      sinkType: 'overmount',
      sinkInstallType: 'overmount',
      hasReinforcement: false,
      hasExtras: false,
      extrasCount: 1,
      hasSeam: false,
      seamCount: 1,
      hasH40: false,
      hasSimpleBoard: false,
      boardLength: '',
      hasMeasurement: false,
      measurementType: 'standard',
      hasInstallation: false,
      hasDelivery: false,
      installationArea: ''
    }]);
    setNextId(nextId + 1);
    setTotalPrice(null);
  };

  const removeItem = (id) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
    setTotalPrice(null);
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
    setTotalPrice(null);
  };

  const togglePolishCorner = (id, cornerId) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const current = item.polishCorners || [];
        const newCorners = current.includes(cornerId)
          ? current.filter(c => c !== cornerId)
          : [...current, cornerId];
        return { ...item, polishCorners: newCorners };
      }
      return item;
    }));
    setTotalPrice(null);
  };

  const calculateStraightPerimeter = (length, width) => {
    return (parseFloat(length) + parseFloat(width)) * 2;
  };

  const calculateCornerPerimeter = (length1, width1, length2, width2) => {
    const perimeter1 = (parseFloat(length1) + parseFloat(width1)) * 2;
    const perimeter2 = (parseFloat(length2) + parseFloat(width2)) * 2;
    const overlap = (parseFloat(width1) + parseFloat(width2)) * 2;
    return perimeter1 + perimeter2 - overlap;
  };

  const calculateUShapePerimeter = (leftL, leftW, centerL, centerW, rightL, rightW) => {
    const leftPerimeter = (parseFloat(leftL) + parseFloat(leftW)) * 2;
    const centerOuter = parseFloat(centerL) * 2;
    const rightPerimeter = (parseFloat(rightL) + parseFloat(rightW)) * 2;
    const subtractLeftRight = (parseFloat(leftW) + parseFloat(rightW)) * 2;
    return leftPerimeter + centerOuter + rightPerimeter - subtractLeftRight;
  };

  const calculateCornerArea = (length1, width1, length2, width2) => {
    const area1 = parseFloat(length1) * parseFloat(width1);
    const area2 = parseFloat(length2) * parseFloat(width2);
    const intersection = parseFloat(width1) * parseFloat(width2);
    return (area1 + area2 - intersection) / 1000000;
  };

  const calculateUShapeArea = (leftL, leftW, centerL, centerW, rightL, rightW) => {
    const leftArea = parseFloat(leftL) * parseFloat(leftW);
    const centerArea = parseFloat(centerL) * parseFloat(centerW);
    const rightArea = parseFloat(rightL) * parseFloat(rightW);
    const intersectionLeft = parseFloat(leftW) * parseFloat(centerW);
    const intersectionRight = parseFloat(rightW) * parseFloat(centerW);
    return (leftArea + centerArea + rightArea - intersectionLeft - intersectionRight) / 1000000;
  };

  const calculatePolishLength = (item, corners) => {
    let polishLengthM = 0;
    const hasTop = corners.includes('top');
    const hasBottom = corners.includes('bottom');
    const hasLeft = corners.includes('left');
    const hasRight = corners.includes('right');
    
    if (item.type === 'straight') {
      const len = parseFloat(item.length);
      const wid = parseFloat(item.width);
      if (hasTop) polishLengthM += len / 1000;
      if (hasBottom) polishLengthM += len / 1000;
      if (hasLeft) polishLengthM += wid / 1000;
      if (hasRight) polishLengthM += wid / 1000;
    } 
    else if (item.type === 'corner') {
      const len1 = parseFloat(item.length1);
      const wid1 = parseFloat(item.width1);
      const len2 = parseFloat(item.length2);
      const wid2 = parseFloat(item.width2);
      if (hasTop) polishLengthM += (len1 + len2) / 1000;
      if (hasBottom) polishLengthM += (len1 + len2) / 1000;
      if (hasLeft) polishLengthM += wid1 / 1000;
      if (hasRight) polishLengthM += wid2 / 1000;
    }
    else if (item.type === 'uShape') {
      const leftL = parseFloat(item.lengthLeft);
      const leftW = parseFloat(item.widthLeft);
      const centerL = parseFloat(item.lengthCenter);
      const centerW = parseFloat(item.widthCenter);
      const rightL = parseFloat(item.lengthRight);
      const rightW = parseFloat(item.widthRight);
      
      if (hasTop) polishLengthM += (leftL + centerL + rightL) / 1000;
      if (hasBottom) polishLengthM += (leftL + centerL + rightL) / 1000;
      if (hasLeft) polishLengthM += leftW / 1000;
      if (hasRight) polishLengthM += rightW / 1000;
    }
    
    return polishLengthM;
  };

  const getMaxDimension = (item) => {
    if (item.type === 'straight') {
      return Math.max(parseFloat(item.length) || 0, parseFloat(item.width) || 0) / 1000;
    }
    else if (item.type === 'corner') {
      return Math.max(
        parseFloat(item.length1) || 0, 
        parseFloat(item.width1) || 0,
        parseFloat(item.length2) || 0, 
        parseFloat(item.width2) || 0
      ) / 1000;
    }
    else {
      return Math.max(
        parseFloat(item.lengthLeft) || 0,
        parseFloat(item.widthLeft) || 0,
        parseFloat(item.lengthCenter) || 0,
        parseFloat(item.widthCenter) || 0,
        parseFloat(item.lengthRight) || 0,
        parseFloat(item.widthRight) || 0
      ) / 1000;
    }
  };

  const calculatePrice = () => {
    let isValid = true;
    let totalPerimeterMm = 0;
    let totalArea = 0;
    let details = [];
    
    for (const item of items) {
      let perimeterMm = 0;
      let area = 0;
      let maxDimension = 0;
      
      const polishCorners = item.polishCorners || [];
      
      if (item.type === 'straight') {
        const len = parseFloat(item.length);
        const wid = parseFloat(item.width);
        if (isNaN(len) || isNaN(wid) || len <= 0 || wid <= 0) {
          isValid = false;
          break;
        }
        perimeterMm = calculateStraightPerimeter(len, wid);
        area = (len * wid) / 1000000;
        maxDimension = Math.max(len, wid) / 1000;
      } 
      else if (item.type === 'corner') {
        const len1 = parseFloat(item.length1);
        const wid1 = parseFloat(item.width1);
        const len2 = parseFloat(item.length2);
        const wid2 = parseFloat(item.width2);
        if (isNaN(len1) || isNaN(wid1) || isNaN(len2) || isNaN(wid2) || len1 <= 0 || wid1 <= 0 || len2 <= 0 || wid2 <= 0) {
          isValid = false;
          break;
        }
        perimeterMm = calculateCornerPerimeter(len1, wid1, len2, wid2);
        area = calculateCornerArea(len1, wid1, len2, wid2);
        maxDimension = Math.max(len1, wid1, len2, wid2) / 1000;
      }
      else if (item.type === 'uShape') {
        const leftL = parseFloat(item.lengthLeft);
        const leftW = parseFloat(item.widthLeft);
        const centerL = parseFloat(item.lengthCenter);
        const centerW = parseFloat(item.widthCenter);
        const rightL = parseFloat(item.lengthRight);
        const rightW = parseFloat(item.widthRight);
        if (isNaN(leftL) || isNaN(leftW) || isNaN(centerL) || isNaN(centerW) || isNaN(rightL) || isNaN(rightW) ||
            leftL <= 0 || leftW <= 0 || centerL <= 0 || centerW <= 0 || rightL <= 0 || rightW <= 0) {
          isValid = false;
          break;
        }
        perimeterMm = calculateUShapePerimeter(leftL, leftW, centerL, centerW, rightL, rightW);
        area = calculateUShapeArea(leftL, leftW, centerL, centerW, rightL, rightW);
        maxDimension = Math.max(leftL, leftW, centerL, centerW, rightL, rightW) / 1000;
      }
      
      totalPerimeterMm += perimeterMm;
      totalArea += area;
      
      const perimeterM = perimeterMm / 1000;
      const cutPrice = perimeterM * (prices.cutPerMeter || 0);
      
      const polishLengthM = calculatePolishLength(item, polishCorners);
      const polishPrice = polishLengthM * (prices.polishPerMeter || 0);
      
      let hobPrice = 0;
      let hobTypeName = '';
      if (item.hasHob) {
        hobPrice = item.hobType === 'standard' ? (prices.hobStandard || 0) : (prices.hobFlush || 0);
        hobTypeName = item.hobType === 'standard' ? 'обычная' : 'заподлицо';
      }
      
      let sinkPrice = 0;
      let sinkTypeName = '';
      if (item.hasSink) {
        if (item.sinkType === 'overmount') {
          sinkPrice = prices.sinkOvermount || 0;
          sinkTypeName = 'накладная';
        } else if (item.sinkType === 'undermount') {
          sinkPrice = prices.sinkUndermount || 0;
          sinkTypeName = 'нижнего монтажа';
        } else {
          sinkPrice = prices.sinkRoundOval || 0;
          sinkTypeName = 'круг/овал';
        }
      }
      
      let sinkInstallPrice = 0;
      let sinkInstallTypeName = '';
      if (item.hasSink) {
        if (item.sinkInstallType === 'overmount') {
          sinkInstallPrice = prices.sinkInstallOvermount || 0;
          sinkInstallTypeName = 'накладная';
        } else {
          sinkInstallPrice = prices.sinkInstallUndermount || 0;
          sinkInstallTypeName = 'нижнего монтажа';
        }
      }
      
      const reinforcementPrice = item.hasReinforcement ? (prices.reinforcement || 0) : 0;
      const extrasPrice = item.hasExtras ? ((prices.extras || 0) * (item.extrasCount || 1)) : 0;
      const seamPrice = item.hasSeam ? ((prices.seam || 0) * (item.seamCount || 1)) : 0;
      
      const measurementPrice = item.hasMeasurement ? (item.measurementType === 'standard' ? (prices.measurementStandard || 0) : (prices.measurementLarge || 0)) : 0;
      
      let installationPrice = 0;
      if (item.hasInstallation) {
        if (item.type === 'straight') {
          const wid = parseFloat(item.width);
          installationPrice = area * (wid <= 300 ? prices.installationNarrow : prices.installationStandard);
        } else if (item.type === 'corner') {
          const wid1 = parseFloat(item.width1);
          const wid2 = parseFloat(item.width2);
          const avgWidth = (wid1 + wid2) / 2;
          installationPrice = area * (avgWidth <= 300 ? prices.installationNarrow : prices.installationStandard);
        } else {
          const leftW = parseFloat(item.widthLeft);
          const centerW = parseFloat(item.widthCenter);
          const rightW = parseFloat(item.widthRight);
          const avgWidth = (leftW + centerW + rightW) / 3;
          installationPrice = area * (avgWidth <= 300 ? prices.installationNarrow : prices.installationStandard);
        }
      }
      
      const fabricationCost = cutPrice + polishPrice + hobPrice + sinkPrice + reinforcementPrice + extrasPrice + seamPrice;
      
      let h40Price = 0;
      if (item.hasH40) {
        h40Price = fabricationCost * (prices.h40Percent / 100);
      }
      
      let simpleBoardPrice = 0;
      if (item.hasSimpleBoard) {
        const boardLen = parseFloat(item.boardLength);
        if (!isNaN(boardLen) && boardLen > 0) {
          simpleBoardPrice = boardLen * (prices.simpleBoard || 0);
        }
      }
      
      let deliveryPrice = 0;
      if (item.hasDelivery) {
        if (maxDimension <= 2) {
          deliveryPrice = prices.deliveryUpTo2m || 0;
        } else {
          deliveryPrice = prices.deliveryOver2m || 0;
        }
      }
      
      const itemTotal = fabricationCost + h40Price + simpleBoardPrice + sinkInstallPrice + measurementPrice + installationPrice + deliveryPrice;
      
      details.push({
        id: item.id,
        type: item.type,
        ...(item.type === 'straight' && {
          length: parseFloat(item.length),
          width: parseFloat(item.width)
        }),
        ...(item.type === 'corner' && {
          length1: parseFloat(item.length1),
          width1: parseFloat(item.width1),
          length2: parseFloat(item.length2),
          width2: parseFloat(item.width2)
        }),
        ...(item.type === 'uShape' && {
          lengthLeft: parseFloat(item.lengthLeft),
          widthLeft: parseFloat(item.widthLeft),
          lengthCenter: parseFloat(item.lengthCenter),
          widthCenter: parseFloat(item.widthCenter),
          lengthRight: parseFloat(item.lengthRight),
          widthRight: parseFloat(item.widthRight)
        }),
        area: area,
        perimeter: perimeterMm,
        cutPrice,
        polishPrice,
        polishCorners,
        polishLengthM,
        hasHob: item.hasHob,
        hobPrice,
        hobTypeName,
        hasSink: item.hasSink,
        sinkPrice,
        sinkTypeName,
        sinkInstallPrice,
        sinkInstallTypeName,
        hasReinforcement: item.hasReinforcement,
        reinforcementPrice,
        hasExtras: item.hasExtras,
        extrasCount: item.extrasCount || 1,
        extrasPrice,
        hasSeam: item.hasSeam,
        seamCount: item.seamCount || 1,
        seamPrice,
        hasH40: item.hasH40,
        h40Price,
        hasSimpleBoard: item.hasSimpleBoard,
        simpleBoardPrice,
        boardLength: item.boardLength,
        hasMeasurement: item.hasMeasurement,
        measurementType: item.measurementType,
        measurementPrice,
        hasInstallation: item.hasInstallation,
        installationPrice,
        hasDelivery: item.hasDelivery,
        deliveryPrice,
        maxDimension,
        fabricationCost,
        itemTotal
      });
    }
    
    if (!isValid) {
      setTotalPrice(null);
      return;
    }
    
    const total = details.reduce((sum, d) => sum + d.itemTotal, 0);
    
    setTotalPrice({
      total,
      cutTotal: details.reduce((sum, d) => sum + d.cutPrice, 0),
      polishTotal: details.reduce((sum, d) => sum + d.polishPrice, 0),
      hobTotal: details.reduce((sum, d) => sum + d.hobPrice, 0),
      sinkTotal: details.reduce((sum, d) => sum + d.sinkPrice, 0),
      sinkInstallTotal: details.reduce((sum, d) => sum + d.sinkInstallPrice, 0),
      reinforcementTotal: details.reduce((sum, d) => sum + d.reinforcementPrice, 0),
      extrasTotal: details.reduce((sum, d) => sum + d.extrasPrice, 0),
      seamTotal: details.reduce((sum, d) => sum + d.seamPrice, 0),
      h40Total: details.reduce((sum, d) => sum + d.h40Price, 0),
      simpleBoardTotal: details.reduce((sum, d) => sum + d.simpleBoardPrice, 0),
      measurementTotal: details.reduce((sum, d) => sum + d.measurementPrice, 0),
      installationTotal: details.reduce((sum, d) => sum + d.installationPrice, 0),
      deliveryTotal: details.reduce((sum, d) => sum + d.deliveryPrice, 0),
      totalArea,
      perimeter: totalPerimeterMm,
      details
    });
  };

  const getPolishCornersText = (corners) => {
    if (!corners || corners.length === 0) return 'не выбрано';
    const labels = {
      top: 'верхняя',
      bottom: 'нижняя',
      left: 'левая',
      right: 'правая'
    };
    return corners.map(c => labels[c]).join(', ');
  };

  return (
    <div className="App">
      <div className="calculator-container">
        <h1 className="title">Калькулятор распила и полировки</h1>
        
        <div className="price-settings-wrapper">
          <button className="price-settings-toggle" onClick={() => setPriceSettingsOpen(!priceSettingsOpen)}>
            <span className="toggle-icon">{priceSettingsOpen ? '▼' : '▶'}</span>
            Настройка цен
            <span className="toggle-hint">{priceSettingsOpen ? 'Свернуть' : 'Развернуть'}</span>
          </button>
          
          {priceSettingsOpen && (
            <div className="price-settings">
              <div className="price-category">
                <h3 className="price-category-title">🔧 Основные услуги</h3>
                <div className="price-row"><label>Распил ($/пог.м)</label><input type="number" value={prices.cutPerMeter} onChange={(e) => updatePrice('cutPerMeter', e.target.value)} step="0.5" min="0" className="price-input" /></div>
                <div className="price-row"><label>Полировка ($/пог.м)</label><input type="number" value={prices.polishPerMeter} onChange={(e) => updatePrice('polishPerMeter', e.target.value)} step="0.5" min="0" className="price-input" /></div>
                <div className="price-row"><label>Шов / Подгонка ($/шт)</label><input type="number" value={prices.seam} onChange={(e) => updatePrice('seam', e.target.value)} step="5" min="0" className="price-input" /></div>
              </div>

              <div className="price-category">
                <h3 className="price-category-title">🍳 Варочная панель</h3>
                <div className="price-row"><label>Обычная ($)</label><input type="number" value={prices.hobStandard} onChange={(e) => updatePrice('hobStandard', e.target.value)} step="5" min="0" className="price-input" /></div>
                <div className="price-row"><label>Заподлицо ($)</label><input type="number" value={prices.hobFlush} onChange={(e) => updatePrice('hobFlush', e.target.value)} step="5" min="0" className="price-input" /></div>
              </div>

              <div className="price-category">
                <h3 className="price-category-title">🚰 Мойка (вырез)</h3>
                <div className="price-row"><label>Накладная ($)</label><input type="number" value={prices.sinkOvermount} onChange={(e) => updatePrice('sinkOvermount', e.target.value)} step="5" min="0" className="price-input" /></div>
                <div className="price-row"><label>Нижнего монтажа ($)</label><input type="number" value={prices.sinkUndermount} onChange={(e) => updatePrice('sinkUndermount', e.target.value)} step="5" min="0" className="price-input" /></div>
                <div className="price-row"><label>Круг / Овал ($)</label><input type="number" value={prices.sinkRoundOval} onChange={(e) => updatePrice('sinkRoundOval', e.target.value)} step="5" min="0" className="price-input" /></div>
                <div className="price-row"><label>Монтаж мойки накладной ($)</label><input type="number" value={prices.sinkInstallOvermount} onChange={(e) => updatePrice('sinkInstallOvermount', e.target.value)} step="5" min="0" className="price-input" /></div>
                <div className="price-row"><label>Монтаж мойки нижнего монтажа ($)</label><input type="number" value={prices.sinkInstallUndermount} onChange={(e) => updatePrice('sinkInstallUndermount', e.target.value)} step="5" min="0" className="price-input" /></div>
              </div>

              <div className="price-category">
                <h3 className="price-category-title">➕ Дополнительные услуги</h3>
                <div className="price-row"><label>Усиление креплениями ($)</label><input type="number" value={prices.reinforcement} onChange={(e) => updatePrice('reinforcement', e.target.value)} step="5" min="0" className="price-input" /></div>
                <div className="price-row"><label>Углы/радиусы/уши/отверстия/розетки ($/шт)</label><input type="number" value={prices.extras} onChange={(e) => updatePrice('extras', e.target.value)} step="5" min="0" className="price-input" /></div>
                <div className="price-row"><label>H-40 (% от стоимости изготовления)</label><input type="number" value={prices.h40Percent} onChange={(e) => updatePrice('h40Percent', e.target.value)} step="1" min="0" className="price-input" /></div>
                <div className="price-row"><label>Простой борт ($/пог.м)</label><input type="number" value={prices.simpleBoard} onChange={(e) => updatePrice('simpleBoard', e.target.value)} step="5" min="0" className="price-input" /></div>
              </div>

              <div className="price-category">
                <h3 className="price-category-title">📏 Замер и монтаж</h3>
                <div className="price-row"><label>Замер обычный ($)</label><input type="number" value={prices.measurementStandard} onChange={(e) => updatePrice('measurementStandard', e.target.value)} step="5" min="0" className="price-input" /></div>
                <div className="price-row"><label>Замер большой ($)</label><input type="number" value={prices.measurementLarge} onChange={(e) => updatePrice('measurementLarge', e.target.value)} step="5" min="0" className="price-input" /></div>
                <div className="price-row"><label>Монтаж столешницы ($/м²)</label><input type="number" value={prices.installationStandard} onChange={(e) => updatePrice('installationStandard', e.target.value)} step="5" min="0" className="price-input" /></div>
                <div className="price-row"><label>Монтаж (ширина до 300 мм) ($/м²)</label><input type="number" value={prices.installationNarrow} onChange={(e) => updatePrice('installationNarrow', e.target.value)} step="5" min="0" className="price-input" /></div>
              </div>

              <div className="price-category">
                <h3 className="price-category-title">🚚 Доставка</h3>
                <div className="price-row"><label>Доставка до 2х метров ($)</label><input type="number" value={prices.deliveryUpTo2m} onChange={(e) => updatePrice('deliveryUpTo2m', e.target.value)} step="5" min="0" className="price-input" /></div>
                <div className="price-row"><label>Доставка свыше 2х метров ($)</label><input type="number" value={prices.deliveryOver2m} onChange={(e) => updatePrice('deliveryOver2m', e.target.value)} step="5" min="0" className="price-input" /></div>
              </div>
            </div>
          )}
        </div>
        
        {items.map((item) => {
          const polishCorners = item.polishCorners || [];
          let area = 0;
          let installationPricePreview = 0;
          let maxDimension = 0;
          
          if (item.type === 'straight') {
            area = (parseFloat(item.length) * parseFloat(item.width)) / 1000000;
            if (item.hasInstallation) {
              const wid = parseFloat(item.width);
              installationPricePreview = area * (wid <= 300 ? prices.installationNarrow : prices.installationStandard);
            }
            maxDimension = getMaxDimension(item);
          } 
          else if (item.type === 'corner') {
            area = calculateCornerArea(item.length1, item.width1, item.length2, item.width2);
            if (item.hasInstallation) {
              const wid1 = parseFloat(item.width1);
              const wid2 = parseFloat(item.width2);
              const avgWidth = (wid1 + wid2) / 2;
              installationPricePreview = area * (avgWidth <= 300 ? prices.installationNarrow : prices.installationStandard);
            }
            maxDimension = getMaxDimension(item);
          } 
          else {
            area = calculateUShapeArea(item.lengthLeft, item.widthLeft, item.lengthCenter, item.widthCenter, item.lengthRight, item.widthRight);
            if (item.hasInstallation) {
              const leftW = parseFloat(item.widthLeft);
              const centerW = parseFloat(item.widthCenter);
              const rightW = parseFloat(item.widthRight);
              const avgWidth = (leftW + centerW + rightW) / 3;
              installationPricePreview = area * (avgWidth <= 300 ? prices.installationNarrow : prices.installationStandard);
            }
            maxDimension = getMaxDimension(item);
          }
          
          return (
            <div key={item.id} className="item-card">
              <div className="item-header">
                <span className="item-title">Изделие {item.id}</span>
                {items.length > 1 && (<button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>)}
              </div>
              
              <div className="input-group">
                <label>Тип столешницы</label>
                <div className="type-selector">
                  <button type="button" className={`type-btn ${item.type === 'straight' ? 'active' : ''}`} onClick={() => updateItem(item.id, 'type', 'straight')}>📏 Прямая</button>
                  <button type="button" className={`type-btn ${item.type === 'corner' ? 'active' : ''}`} onClick={() => updateItem(item.id, 'type', 'corner')}>📐 Г-образная</button>
                  <button type="button" className={`type-btn ${item.type === 'uShape' ? 'active' : ''}`} onClick={() => updateItem(item.id, 'type', 'uShape')}>🏠 П-образная</button>
                </div>
              </div>
              
              {item.type === 'straight' ? (
                <>
                  <div className="input-group">
                    <label>Длина (мм)</label>
                    <input type="number" value={item.length} onChange={(e) => updateItem(item.id, 'length', e.target.value)} placeholder="Введите длину, мм" step="1" />
                  </div>
                  <div className="input-group">
                    <label>Ширина (мм)</label>
                    <input type="number" value={item.width} onChange={(e) => updateItem(item.id, 'width', e.target.value)} placeholder="Введите ширину, мм" step="1" />
                  </div>
                </>
              ) : item.type === 'corner' ? (
                <div className="corner-dimensions">
                  <div className="corner-side">
                    <h4>Первая сторона</h4>
                    <div className="input-group"><label>Длина 1 (мм)</label><input type="number" value={item.length1} onChange={(e) => updateItem(item.id, 'length1', e.target.value)} placeholder="Длина" step="1" /></div>
                    <div className="input-group"><label>Ширина 1 (мм)</label><input type="number" value={item.width1} onChange={(e) => updateItem(item.id, 'width1', e.target.value)} placeholder="Ширина" step="1" /></div>
                  </div>
                  <div className="corner-side">
                    <h4>Вторая сторона</h4>
                    <div className="input-group"><label>Длина 2 (мм)</label><input type="number" value={item.length2} onChange={(e) => updateItem(item.id, 'length2', e.target.value)} placeholder="Длина" step="1" /></div>
                    <div className="input-group"><label>Ширина 2 (мм)</label><input type="number" value={item.width2} onChange={(e) => updateItem(item.id, 'width2', e.target.value)} placeholder="Ширина" step="1" /></div>
                  </div>
                </div>
              ) : (
                <div className="ushape-dimensions">
                  <div className="ushape-side">
                    <h4>Левая секция</h4>
                    <div className="input-group"><label>Длина левой (мм)</label><input type="number" value={item.lengthLeft} onChange={(e) => updateItem(item.id, 'lengthLeft', e.target.value)} placeholder="Длина" step="1" /></div>
                    <div className="input-group"><label>Ширина левой (мм)</label><input type="number" value={item.widthLeft} onChange={(e) => updateItem(item.id, 'widthLeft', e.target.value)} placeholder="Ширина" step="1" /></div>
                  </div>
                  <div className="ushape-side">
                    <h4>Центральная секция</h4>
                    <div className="input-group"><label>Длина центральной (мм)</label><input type="number" value={item.lengthCenter} onChange={(e) => updateItem(item.id, 'lengthCenter', e.target.value)} placeholder="Длина" step="1" /></div>
                    <div className="input-group"><label>Ширина центральной (мм)</label><input type="number" value={item.widthCenter} onChange={(e) => updateItem(item.id, 'widthCenter', e.target.value)} placeholder="Ширина" step="1" /></div>
                  </div>
                  <div className="ushape-side">
                    <h4>Правая секция</h4>
                    <div className="input-group"><label>Длина правой (мм)</label><input type="number" value={item.lengthRight} onChange={(e) => updateItem(item.id, 'lengthRight', e.target.value)} placeholder="Длина" step="1" /></div>
                    <div className="input-group"><label>Ширина правой (мм)</label><input type="number" value={item.widthRight} onChange={(e) => updateItem(item.id, 'widthRight', e.target.value)} placeholder="Ширина" step="1" /></div>
                  </div>
                </div>
              )}
              
              <div className="input-group">
                <label>Полировка сторон</label>
                <div className="polish-visual">
                  <div className="polish-rectangle">
                    <button type="button" className={`polish-side top ${polishCorners.includes('top') ? 'active' : ''}`} onClick={() => togglePolishCorner(item.id, 'top')}>Верхняя сторона</button>
                    <div className="polish-middle">
                      <button type="button" className={`polish-side left ${polishCorners.includes('left') ? 'active' : ''}`} onClick={() => togglePolishCorner(item.id, 'left')}>Левая</button>
                      <div className="polish-center">Изделие</div>
                      <button type="button" className={`polish-side right ${polishCorners.includes('right') ? 'active' : ''}`} onClick={() => togglePolishCorner(item.id, 'right')}>Правая</button>
                    </div>
                    <button type="button" className={`polish-side bottom ${polishCorners.includes('bottom') ? 'active' : ''}`} onClick={() => togglePolishCorner(item.id, 'bottom')}>Нижняя сторона</button>
                  </div>
                </div>
              </div>

              <div className="input-group option-group">
                <label className="checkbox-label"><input type="checkbox" checked={item.hasHob} onChange={(e) => updateItem(item.id, 'hasHob', e.target.checked)} /><span>Вырез под варочную панель</span></label>
                {item.hasHob && (
                  <div className="radio-group">
                    <label className="radio-label"><input type="radio" name={`hobType-${item.id}`} value="standard" checked={item.hobType === 'standard'} onChange={(e) => updateItem(item.id, 'hobType', e.target.value)} /><span>Обычная ({prices.hobStandard}$)</span></label>
                    <label className="radio-label"><input type="radio" name={`hobType-${item.id}`} value="flush" checked={item.hobType === 'flush'} onChange={(e) => updateItem(item.id, 'hobType', e.target.value)} /><span>Заподлицо ({prices.hobFlush}$)</span></label>
                  </div>
                )}
              </div>

              <div className="input-group option-group">
                <label className="checkbox-label"><input type="checkbox" checked={item.hasSink} onChange={(e) => updateItem(item.id, 'hasSink', e.target.checked)} /><span>Вырез под мойку</span></label>
                {item.hasSink && (
                  <>
                    <div className="radio-group">
                      <label className="radio-label"><input type="radio" name={`sinkType-${item.id}`} value="overmount" checked={item.sinkType === 'overmount'} onChange={(e) => updateItem(item.id, 'sinkType', e.target.value)} /><span>Накладная ({prices.sinkOvermount}$)</span></label>
                      <label className="radio-label"><input type="radio" name={`sinkType-${item.id}`} value="undermount" checked={item.sinkType === 'undermount'} onChange={(e) => updateItem(item.id, 'sinkType', e.target.value)} /><span>Нижнего монтажа ({prices.sinkUndermount}$)</span></label>
                      <label className="radio-label"><input type="radio" name={`sinkType-${item.id}`} value="roundOval" checked={item.sinkType === 'roundOval'} onChange={(e) => updateItem(item.id, 'sinkType', e.target.value)} /><span>Круг / Овал ({prices.sinkRoundOval}$)</span></label>
                    </div>
                    <div className="radio-group" style={{ marginTop: 10 }}>
                      <label className="radio-label"><input type="radio" name={`sinkInstall-${item.id}`} value="overmount" checked={item.sinkInstallType === 'overmount'} onChange={(e) => updateItem(item.id, 'sinkInstallType', e.target.value)} /><span>Монтаж накладной ({prices.sinkInstallOvermount}$)</span></label>
                      <label className="radio-label"><input type="radio" name={`sinkInstall-${item.id}`} value="undermount" checked={item.sinkInstallType === 'undermount'} onChange={(e) => updateItem(item.id, 'sinkInstallType', e.target.value)} /><span>Монтаж нижнего монтажа ({prices.sinkInstallUndermount}$)</span></label>
                    </div>
                  </>
                )}
              </div>

              <div className="input-group option-group">
                <label className="checkbox-label"><input type="checkbox" checked={item.hasReinforcement} onChange={(e) => updateItem(item.id, 'hasReinforcement', e.target.checked)} /><span>Усиление креплениями ({prices.reinforcement}$)</span></label>
              </div>

              <div className="input-group option-group">
                <label className="checkbox-label"><input type="checkbox" checked={item.hasExtras} onChange={(e) => updateItem(item.id, 'hasExtras', e.target.checked)} /><span>Углы / Радиусы / Уши / Отверстия / Розетки ({prices.extras}$/шт)</span></label>
                {item.hasExtras && (
                  <div className="extras-count">
                    <label>Количество:</label>
                    <input type="number" min="1" max="99" value={item.extrasCount} onChange={(e) => updateItem(item.id, 'extrasCount', parseInt(e.target.value) || 1)} className="extras-input" />
                    <span className="extras-total"> = {(prices.extras || 0) * (item.extrasCount || 1)} $</span>
                  </div>
                )}
              </div>

              <div className="input-group option-group">
                <label className="checkbox-label"><input type="checkbox" checked={item.hasSeam} onChange={(e) => updateItem(item.id, 'hasSeam', e.target.checked)} /><span>Шов / Подгонка ({prices.seam}$/шт)</span></label>
                {item.hasSeam && (
                  <div className="extras-count">
                    <label>Количество швов:</label>
                    <input type="number" min="1" max="20" value={item.seamCount} onChange={(e) => updateItem(item.id, 'seamCount', parseInt(e.target.value) || 1)} className="extras-input" />
                    <span className="extras-total"> = {(prices.seam || 0) * (item.seamCount || 1)} $</span>
                  </div>
                )}
              </div>

              <div className="input-group option-group">
                <label className="checkbox-label"><input type="checkbox" checked={item.hasH40} onChange={(e) => updateItem(item.id, 'hasH40', e.target.checked)} /><span>H-40 (борт с зашивкой, +{prices.h40Percent}%)</span></label>
              </div>

              <div className="input-group option-group">
                <label className="checkbox-label"><input type="checkbox" checked={item.hasSimpleBoard} onChange={(e) => updateItem(item.id, 'hasSimpleBoard', e.target.checked)} /><span>Простой борт (без зашивки, {prices.simpleBoard}$/м)</span></label>
                {item.hasSimpleBoard && (
                  <div className="extras-count">
                    <label>Длина борта (м):</label>
                    <input type="number" step="0.1" min="0" value={item.boardLength} onChange={(e) => updateItem(item.id, 'boardLength', e.target.value)} className="extras-input" placeholder="м" />
                    {item.boardLength && <span className="extras-total"> = {(parseFloat(item.boardLength) * prices.simpleBoard).toFixed(2)} $</span>}
                  </div>
                )}
              </div>

              <div className="input-group option-group">
                <label className="checkbox-label"><input type="checkbox" checked={item.hasMeasurement} onChange={(e) => updateItem(item.id, 'hasMeasurement', e.target.checked)} /><span>Добавить замер</span></label>
                {item.hasMeasurement && (
                  <div className="radio-group" style={{ marginTop: 10 }}>
                    <label className="radio-label"><input type="radio" name={`measurement-${item.id}`} value="standard" checked={item.measurementType === 'standard'} onChange={(e) => updateItem(item.id, 'measurementType', e.target.value)} /><span>Обычный ({prices.measurementStandard}$)</span></label>
                    <label className="radio-label"><input type="radio" name={`measurement-${item.id}`} value="large" checked={item.measurementType === 'large'} onChange={(e) => updateItem(item.id, 'measurementType', e.target.value)} /><span>Большой ({prices.measurementLarge}$)</span></label>
                  </div>
                )}
              </div>

              <div className="input-group option-group">
                <label className="checkbox-label"><input type="checkbox" checked={item.hasInstallation} onChange={(e) => updateItem(item.id, 'hasInstallation', e.target.checked)} /><span>Добавить монтаж столешницы</span></label>
                {item.hasInstallation && (
                  <div className="installation-info" style={{ marginTop: 10 }}>
                    <p>Площадь: <strong>{area.toFixed(3)} м²</strong></p>
                    <p>Стоимость монтажа: <strong>{installationPricePreview.toFixed(2)} $</strong></p>
                  </div>
                )}
              </div>

              <div className="input-group option-group">
                <label className="checkbox-label"><input type="checkbox" checked={item.hasDelivery} onChange={(e) => updateItem(item.id, 'hasDelivery', e.target.checked)} /><span>🚚 Добавить доставку</span></label>
                {item.hasDelivery && (
                  <div className="delivery-info" style={{ marginTop: 10 }}>
                    <p>Максимальный размер: <strong>{maxDimension.toFixed(1)} м</strong></p>
                    <p>Стоимость доставки: <strong>{maxDimension <= 2 ? prices.deliveryUpTo2m : prices.deliveryOver2m} $</strong></p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        <button className="add-item-btn" onClick={addItem}>+ Добавить изделие</button>
        <button className="calculate-btn" onClick={calculatePrice}>Рассчитать стоимость</button>
        
        {totalPrice !== null && (
          <div className="result">
            <div className="result-summary">
              <p>Общая стоимость: <span>{totalPrice.total.toFixed(2)} $</span></p>
              <div className="result-breakdown">
                <p>Распил: <span>{totalPrice.cutTotal.toFixed(2)} $</span></p>
                <p>Полировка: <span>{totalPrice.polishTotal.toFixed(2)} $</span></p>
                {totalPrice.hobTotal > 0 && <p>Варочные панели: <span>{totalPrice.hobTotal.toFixed(2)} $</span></p>}
                {totalPrice.sinkTotal > 0 && <p>Вырезы под мойки: <span>{totalPrice.sinkTotal.toFixed(2)} $</span></p>}
                {totalPrice.sinkInstallTotal > 0 && <p>Монтаж моек: <span>{totalPrice.sinkInstallTotal.toFixed(2)} $</span></p>}
                {totalPrice.reinforcementTotal > 0 && <p>Усиление: <span>{totalPrice.reinforcementTotal.toFixed(2)} $</span></p>}
                {totalPrice.extrasTotal > 0 && <p>Доп. вырезы: <span>{totalPrice.extrasTotal.toFixed(2)} $</span></p>}
                {totalPrice.seamTotal > 0 && <p>Шов/подгонка: <span>{totalPrice.seamTotal.toFixed(2)} $</span></p>}
                {totalPrice.h40Total > 0 && <p>H-40: <span>{totalPrice.h40Total.toFixed(2)} $</span></p>}
                {totalPrice.simpleBoardTotal > 0 && <p>Простой борт: <span>{totalPrice.simpleBoardTotal.toFixed(2)} $</span></p>}
                {totalPrice.measurementTotal > 0 && <p>Замер: <span>{totalPrice.measurementTotal.toFixed(2)} $</span></p>}
                {totalPrice.installationTotal > 0 && <p>Монтаж: <span>{totalPrice.installationTotal.toFixed(2)} $</span></p>}
                {totalPrice.deliveryTotal > 0 && <p>Доставка: <span>{totalPrice.deliveryTotal.toFixed(2)} $</span></p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;