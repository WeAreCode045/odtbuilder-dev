import React, { useRef, useState } from 'react';
import { useEditor } from '@craftjs/core';
import { Download, FileText, Upload, Loader2 } from 'lucide-react';
import JSZip from 'jszip';

export const Header: React.FC = () => {
  const { query, actions } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const json = query.serialize();
      const isLocal = window.location.hostname === 'localhost';
      const BACKEND_URL = isLocal 
        ? "http://localhost:8000/generate-odt" 
        : "https://odt-generator.code045.nl/generate-odt";

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          data: typeof json === 'string' ? JSON.parse(json) : json 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Export mislukt");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'document.odt');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Fout bij exporteren:", error);
      alert(`Er is een fout opgetreden: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const generateId = () => {
    return 'node-' + Math.random().toString(36).substr(2, 9);
  };

  const convertToPx = (value: string | null): number | undefined => {
    if (!value) return undefined;
    const match = value.match(/([\d\.]+)(\w+|%)?/);
    if (!match) return undefined;
    const val = parseFloat(match[1]);
    const unit = match[2];
    switch (unit) {
        case 'in': return Math.round(val * 96);
        case 'cm': return Math.round(val * 37.8);
        case 'mm': return Math.round(val * 3.78);
        case 'pt': return Math.round(val * 1.33);
        case 'px': return Math.round(val);
        default: return Math.round(val);
    }
  };

  // Convert PX back to backend "units" (1 unit = 0.25rem = 4px)
  const pxToUnits = (px: number | undefined): number => {
    if (!px) return 0;
    return Math.round(px / 4);
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const zip = await JSZip.loadAsync(file);
      const contentXml = await zip.file("content.xml")?.async("string");
      if (!contentXml) throw new Error("Ongeldig ODT bestand: content.xml ontbreekt");

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(contentXml, "text/xml");
      const officeText = xmlDoc.getElementsByTagName("office:text")[0];
      if (!officeText) throw new Error("Geen tekst gevonden in document");

      // --- PARSE STYLES ---
      const styles: Record<string, any> = {};
      const automaticStyles = xmlDoc.getElementsByTagName("office:automatic-styles")[0];
      
      const parseStyleNode = (styleNode: Element) => {
            const name = styleNode.getAttribute("style:name");
            if (!name) return;
            
            const textProps = styleNode.getElementsByTagName("style:text-properties")[0];
            const paraProps = styleNode.getElementsByTagName("style:paragraph-properties")[0];
            const cellProps = styleNode.getElementsByTagName("style:table-cell-properties")[0];
            const tableProps = styleNode.getElementsByTagName("style:table-properties")[0];
            const colProps = styleNode.getElementsByTagName("style:table-column-properties")[0];
            
            const styleData: any = {};
            
            if (textProps) {
                const color = textProps.getAttribute("fo:color");
                if (color) styleData.color = color;
                const fontSize = textProps.getAttribute("fo:font-size");
                if (fontSize) styleData.fontSize = convertToPx(fontSize);
                const fontFamily = textProps.getAttribute("fo:font-family") || textProps.getAttribute("style:font-name");
                if (fontFamily) styleData.fontFamily = fontFamily.replace(/['"]/g, "");
                const fontWeight = textProps.getAttribute("fo:font-weight");
                if (fontWeight) styleData.fontWeight = fontWeight;
            }
            
            if (paraProps) {
                const align = paraProps.getAttribute("fo:text-align");
                if (align) styleData.textAlign = align === 'end' ? 'right' : align === 'start' ? 'left' : align;
                const marginTop = paraProps.getAttribute("fo:margin-top");
                if (marginTop) styleData.marginTop = convertToPx(marginTop);
                const marginBottom = paraProps.getAttribute("fo:margin-bottom");
                if (marginBottom) styleData.marginBottom = convertToPx(marginBottom);
            }

            if (cellProps) {
                const padding = cellProps.getAttribute("fo:padding");
                if (padding) styleData.padding = convertToPx(padding);
                const bgColor = cellProps.getAttribute("fo:background-color");
                if (bgColor) styleData.backgroundColor = bgColor;
            }

            if (tableProps) {
                const marginTop = tableProps.getAttribute("fo:margin-top");
                const marginBottom = tableProps.getAttribute("fo:margin-bottom");
                const bgColor = tableProps.getAttribute("fo:background-color");
                if (marginTop) styleData.tableMarginTop = convertToPx(marginTop);
                if (marginBottom) styleData.tableMarginBottom = convertToPx(marginBottom);
                if (bgColor) styleData.backgroundColor = bgColor;
            }

            if (colProps) {
                const width = colProps.getAttribute("style:column-width");
                if (width) styleData.columnWidthPx = convertToPx(width);
            }
            
            styles[name] = styleData;
      };

      if (automaticStyles) {
        Array.from(automaticStyles.getElementsByTagName("style:style")).forEach(parseStyleNode);
      }
      
      // Also parse common styles (less common for auto-gen but good for completeness)
      const officeStyles = xmlDoc.getElementsByTagName("office:styles")[0];
      if (officeStyles) {
          Array.from(officeStyles.getElementsByTagName("style:style")).forEach(parseStyleNode);
      }

      // --- NODE BUILDING ---
      const rootId = "ROOT";
      const pageId = generateId();
      
      const newNodes: any = {
        [rootId]: {
          type: { resolvedName: "Document" },
          isCanvas: true,
          props: {},
          displayName: "Document",
          custom: {},
          hidden: false,
          nodes: [pageId],
          linkedNodes: {},
        },
        [pageId]: {
          type: { resolvedName: "Page" },
          isCanvas: true,
          props: {},
          displayName: "Pagina",
          custom: {},
          parent: rootId,
          hidden: false,
          nodes: [], 
          linkedNodes: {},
        }
      };

      const processImage = async (frame: Element, parentId: string) => {
        const image = frame.getElementsByTagName("draw:image")[0];
        if (image) {
            const href = image.getAttribute("xlink:href");
            if (href && zip.file(href)) {
                const base64 = await zip.file(href)?.async("base64");
                const mime = href.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
                const src = `data:${mime};base64,${base64}`;
                
                // Try to get width from frame style or attributes
                let width = "100%";
                const frameWidth = frame.getAttribute("svg:width");
                if (frameWidth) {
                   // Convert cm to approx % relative to 17cm (A4 content)
                   const px = convertToPx(frameWidth) || 0;
                   const totalW = convertToPx("17cm") || 642;
                   if (px > 0) {
                      width = `${Math.min(100, Math.round((px / totalW) * 100))}%`;
                   }
                }

                const imgId = generateId();
                newNodes[imgId] = {
                    type: { resolvedName: "Afbeelding" },
                    isCanvas: false,
                    props: { src, width },
                    displayName: "Afbeelding",
                    custom: {},
                    parent: parentId,
                    hidden: false,
                    nodes: [],
                    linkedNodes: {}
                };
                newNodes[parentId].nodes.push(imgId);
            }
        }
      };

      const parseNode = async (xmlNode: Element, parentId: string) => {
        const tagName = xmlNode.tagName;
        
        let styleName = xmlNode.getAttribute("text:style-name");
        if (tagName === "table:table") styleName = xmlNode.getAttribute("table:style-name");
        if (tagName === "table:table-cell") styleName = xmlNode.getAttribute("table:style-name");
        
        const style = styleName ? styles[styleName] || {} : {};

        if (tagName === "text:h") {
            const textContent = xmlNode.textContent?.trim();
            if (textContent) {
                const nodeId = generateId();
                newNodes[nodeId] = {
                    type: { resolvedName: "Titel" },
                    isCanvas: false,
                    props: {
                        text: textContent,
                        fontSize: style.fontSize || 24,
                        color: style.color || "#1a202c",
                        textAlign: style.textAlign || "left",
                        fontFamily: style.fontFamily || "inherit",
                        fontWeight: style.fontWeight || "bold"
                    },
                    displayName: "Titel",
                    custom: {},
                    parent: parentId,
                    hidden: false,
                    nodes: [],
                    linkedNodes: {},
                };
                newNodes[parentId].nodes.push(nodeId);
            }
        } else if (tagName === "text:p") {
             const childNodes = Array.from(xmlNode.childNodes);
             let currentText = "";
             // Capture script node if present
             let scriptFound: {lang: string, content: string} | null = null;

             const flushText = () => {
                 if (currentText.trim()) {
                      const nodeId = generateId();
                      newNodes[nodeId] = {
                        type: { resolvedName: "Tekst" },
                        isCanvas: false,
                        props: { 
                            text: currentText.trim(),
                            fontSize: style.fontSize || 14,
                            color: style.color || "#4a5568",
                            textAlign: style.textAlign || "left",
                            fontFamily: style.fontFamily || "inherit",
                            fontWeight: style.fontWeight || "normal"
                        },
                        displayName: "Tekst",
                        custom: {},
                        parent: parentId,
                        hidden: false,
                        nodes: [],
                        linkedNodes: {},
                      };
                      newNodes[parentId].nodes.push(nodeId);
                 }
                 currentText = "";
             };

             for (const child of childNodes) {
                 if (child.nodeType === 3) {
                     currentText += child.textContent || "";
                 } else if (child.nodeType === 1) {
                     const el = child as Element;
                     if (el.tagName === "draw:frame") {
                         flushText();
                         await processImage(el, parentId);
                     } else if (el.tagName === "text:script") {
                         flushText();
                         const lang = el.getAttribute("text:language") || "JOOScript";
                         const content = el.textContent || "";
                         
                         const scriptId = generateId();
                         newNodes[scriptId] = {
                             type: { resolvedName: "ScriptElement" },
                             isCanvas: false,
                             props: { language: lang, content: content },
                             displayName: "Script",
                             custom: {},
                             parent: parentId,
                             hidden: false,
                             nodes: [],
                             linkedNodes: {}
                         };
                         newNodes[parentId].nodes.push(scriptId);
                     } else if (el.tagName === "text:s") {
                         const count = parseInt(el.getAttribute("text:c") || "1");
                         currentText += " ".repeat(count);
                     } else if (el.tagName === "text:tab") {
                         currentText += "\t";
                     } else if (el.tagName === "text:span") {
                        currentText += el.textContent || "";
                     } else {
                         currentText += el.textContent || "";
                     }
                 }
             }
             flushText();

        } else if (tagName === "table:table") {
            // Determine Table Margins (my)
            let my = 0;
            if (style.tableMarginTop || style.tableMarginBottom) {
                const totalMarginPx = (style.tableMarginTop || 0) + (style.tableMarginBottom || 0);
                my = pxToUnits(totalMarginPx / 2); // Average top/bottom or just sum
            }
            
            const tableBg = style.backgroundColor || "transparent";

            // Determine Columns Widths
            const colElements = Array.from(xmlNode.childNodes).filter(
                (n) => n.nodeType === 1 && (n as Element).tagName === "table:table-column"
            ) as Element[];

            const colWidthsPx: number[] = [];
            
            for (const col of colElements) {
                const repeated = parseInt(col.getAttribute("table:number-columns-repeated") || "1");
                const colStyleName = col.getAttribute("table:style-name");
                let pxWidth = 0;
                
                if (colStyleName && styles[colStyleName]?.columnWidthPx) {
                    pxWidth = styles[colStyleName].columnWidthPx;
                }
                
                for (let i = 0; i < repeated; i++) {
                    colWidthsPx.push(pxWidth);
                }
            }

            // Total Width for percentage calc
            // If some cols have 0 width (no style), we try to assume equal distribution of remaining space?
            // For simplicity, let's sum knowns. If total is 0, we can't do %.
            let totalTableWidthPx = colWidthsPx.reduce((a, b) => a + b, 0);
            
            // If total is 0, assume standard A4 width (~642px for 17cm)
            if (totalTableWidthPx === 0) totalTableWidthPx = 642; 

            // Handle Rows
            const rows = Array.from(xmlNode.childNodes).filter(
                (n) => n.nodeType === 1 && (n as Element).tagName === "table:table-row"
            ) as Element[];
            
            for (const row of rows) {
                const rowId = generateId();
                newNodes[rowId] = {
                    type: { resolvedName: "Row" },
                    isCanvas: true,
                    props: { gap: 0, my: my, backgroundColor: tableBg }, 
                    displayName: "Rij",
                    custom: {},
                    parent: parentId,
                    hidden: false,
                    nodes: [],
                    linkedNodes: {}
                };
                newNodes[parentId].nodes.push(rowId);

                const rowChildren = Array.from(row.childNodes).filter(
                    (n) => n.nodeType === 1 && ((n as Element).tagName === "table:table-cell" || (n as Element).tagName === "table:covered-table-cell")
                ) as Element[];
                
                let currentColumnIndex = 0;

                for (const cell of rowChildren) {
                    const tagName = cell.tagName;
                    const colspan = parseInt(cell.getAttribute("table:number-columns-spanned") || "1");
                    
                    // Logic for covered cells (from rowspan)
                    if (tagName === "table:covered-table-cell") {
                        // It occupies a slot but has no content (usually vertically merged). 
                        // We must render a placeholder column to keep layout
                        // Calculate width for this slot
                        let cellWidthPx = 0;
                        for (let k = 0; k < colspan; k++) {
                            cellWidthPx += colWidthsPx[currentColumnIndex + k] || (totalTableWidthPx / colWidthsPx.length);
                        }
                        const widthPercent = (cellWidthPx / totalTableWidthPx) * 100;

                        const colId = generateId();
                        newNodes[colId] = {
                            type: { resolvedName: "Column" },
                            isCanvas: true,
                            props: { width: `${widthPercent.toFixed(2)}%`, padding: 8, backgroundColor: 'transparent' },
                            displayName: "Kolom (Spanned)",
                            custom: {},
                            parent: rowId,
                            hidden: false,
                            nodes: [],
                            linkedNodes: {}
                        };
                        newNodes[rowId].nodes.push(colId);
                        currentColumnIndex += colspan;
                        continue;
                    }

                    // Real Cell
                    const cellStyleName = cell.getAttribute("table:style-name");
                    const cellStyle = cellStyleName ? styles[cellStyleName] || {} : {};
                    
                    // Calculate Width
                    let cellWidthPx = 0;
                    for (let k = 0; k < colspan; k++) {
                         // Default to equal share if unknown
                        const w = colWidthsPx[currentColumnIndex + k];
                        cellWidthPx += w ? w : (totalTableWidthPx / Math.max(1, colWidthsPx.length));
                    }
                    
                    const widthPercent = (cellWidthPx / totalTableWidthPx) * 100;
                    
                    const paddingVal = cellStyle.padding !== undefined ? cellStyle.padding : 8; // Default 8px
                    const bgVal = cellStyle.backgroundColor || "transparent";

                    const colId = generateId();
                    newNodes[colId] = {
                        type: { resolvedName: "Column" },
                        isCanvas: true,
                        props: { 
                            width: `${widthPercent.toFixed(2)}%`,
                            padding: paddingVal,
                            backgroundColor: bgVal
                        },
                        displayName: "Kolom",
                        custom: {},
                        parent: rowId,
                        hidden: false,
                        nodes: [],
                        linkedNodes: {}
                    };
                    newNodes[rowId].nodes.push(colId);

                    // Content
                    const cellContentChildren = Array.from(cell.childNodes);
                    for (const child of cellContentChildren) {
                        if (child.nodeType === 1) {
                            await parseNode(child as Element, colId);
                        }
                    }
                    
                    currentColumnIndex += colspan;
                }
            }
        }
      };

      const childNodes = Array.from(officeText.children);
      for (const node of childNodes) {
        await parseNode(node as Element, pageId);
      }

      actions.deserialize(newNodes);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error("Import error:", error);
      alert("Fout bij importeren: " + (error instanceof Error ? error.message : "Onbekende fout"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-md text-white">
          <FileText size={20} />
        </div>
        <h1 className="font-semibold text-gray-800 text-lg">DocuBuild A4</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <input 
          type="file" 
          accept=".odt" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        
        {isLoading ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-md text-sm font-medium">
            <Loader2 size={16} className="animate-spin" />
            Verwerken...
          </div>
        ) : (
          <>
            <button 
              onClick={handleImportClick}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Upload size={16} />
              Importeer ODT
            </button>

            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Download size={16} />
              Exporteer ODT
            </button>
          </>
        )}
      </div>
    </header>
  );
};