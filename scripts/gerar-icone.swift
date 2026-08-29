import Foundation
import CoreGraphics
import CoreText
import ImageIO
import UniformTypeIdentifiers

// Monograma J&D para o ecrã principal. Cores do próprio site.
let creme  = CGColor(red: 0xF5/255, green: 0xEF/255, blue: 0xE4/255, alpha: 1)
let oliva  = CGColor(red: 0x6B/255, green: 0x7A/255, blue: 0x4F/255, alpha: 1)
let ouro   = CGColor(red: 0xB8/255, green: 0x93/255, blue: 0x5A/255, alpha: 1)

func fonte(_ nomes: [String], _ tamanho: CGFloat) -> CTFont {
    for n in nomes {
        let f = CTFontCreateWithName(n as CFString, tamanho, nil)
        if (CTFontCopyPostScriptName(f) as String).lowercased().contains(n.prefix(6).lowercased()) { return f }
    }
    return CTFontCreateWithName("Times New Roman" as CFString, tamanho, nil)
}

func linha(_ texto: String, _ f: CTFont, _ cor: CGColor) -> CTLine {
    let a: [CFString: Any] = [
        kCTFontAttributeName: f,
        kCTForegroundColorAttributeName: cor,
        kCTLigatureAttributeName: 0,
    ]
    let s = CFAttributedStringCreate(nil, texto as CFString, a as CFDictionary)!
    return CTLineCreateWithAttributedString(s)
}

func largura(_ l: CTLine) -> CGFloat { CTLineGetTypographicBounds(l, nil, nil, nil) }

func desenhar(_ S: CGFloat, _ destino: String) {
    let esp = CGColorSpaceCreateDeviceRGB()
    guard let ctx = CGContext(data: nil, width: Int(S), height: Int(S),
                              bitsPerComponent: 8, bytesPerRow: 0, space: esp,
                              bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { return }

    ctx.setFillColor(creme)
    ctx.fill(CGRect(x: 0, y: 0, width: S, height: S))

    // Dois anéis concêntricos
    ctx.setStrokeColor(oliva)
    ctx.setLineWidth(max(1, S * 0.007))
    for r in [S * 0.435, S * 0.405] {
        ctx.addEllipse(in: CGRect(x: S/2 - r, y: S/2 - r, width: r*2, height: r*2))
        ctx.strokePath()
    }

    let fJD = fonte(["Didot", "Baskerville", "Times New Roman"], S * 0.40)
    let fE  = fonte(["SnellRoundhand", "Snell Roundhand", "Zapfino"], S * 0.30)

    let lJ = linha("J", fJD, ouro)
    let lD = linha("D", fJD, ouro)
    let lE = linha("&", fE, ouro)

    let gap = S * 0.022
    let total = largura(lJ) + gap + largura(lE) + gap + largura(lD)
    var x = S/2 - total/2
    let base = S/2 - CTFontGetCapHeight(fJD)/2

    ctx.textPosition = CGPoint(x: x, y: base); CTLineDraw(lJ, ctx); x += largura(lJ) + gap
    ctx.textPosition = CGPoint(x: x, y: base + S*0.020); CTLineDraw(lE, ctx); x += largura(lE) + gap
    ctx.textPosition = CGPoint(x: x, y: base); CTLineDraw(lD, ctx)

    guard let img = ctx.makeImage() else { return }
    let url = URL(fileURLWithPath: destino) as CFURL
    guard let dst = CGImageDestinationCreateWithURL(url, UTType.png.identifier as CFString, 1, nil) else { return }
    CGImageDestinationAddImage(dst, img, nil)
    if CGImageDestinationFinalize(dst) {
        print("escrito \(destino) (\(Int(S))px)")
    }
}

let args = CommandLine.arguments
desenhar(CGFloat(Double(args[1])!), args[2])
