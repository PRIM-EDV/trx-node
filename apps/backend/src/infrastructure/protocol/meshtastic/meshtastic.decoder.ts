import { createDecipheriv } from "node:crypto";
import { Data } from "@meshtastic/protocol";

export namespace MeshtasticDecoder {
    export const DEFAULT_PSK = Buffer.from([
        0xd4, 0xf1, 0xbb, 0x3a, 0x20, 0x29, 0x07, 0x59,
        0xf0, 0xbc, 0xff, 0xab, 0xcf, 0x4e, 0x69, 0x01,
    ]);

    export interface MeshtasticHeader {
        to: number;
        from: number;
        id: number;
        flags: number;
        channelHash: number;
        nextHop: number;
        relayNode: number;
    }

    export function parseHeader(buf: Buffer): MeshtasticHeader {
        return {
            to: buf.readUInt32LE(0),
            from: buf.readUInt32LE(4),
            id: buf.readUInt32LE(8),
            flags: buf.readUInt8(12),
            channelHash: buf.readUInt8(13),
            nextHop: buf.readUInt8(14),
            relayNode: buf.readUInt8(15),
        };
    }

    export function buildNonce(packetId: number, fromNode: number): Buffer {
        const nonce = Buffer.alloc(16);
        nonce.writeUInt32LE(packetId >>> 0, 0);
        nonce.writeUInt32LE(fromNode >>> 0, 8);
        return nonce;
    }

    export function decryptPayload(ciphertext: Buffer, header: MeshtasticHeader, psk: Buffer = DEFAULT_PSK): Buffer {
        const algorithm = psk.length === 32 ? 'aes-256-ctr' : 'aes-128-ctr';
        const iv = buildNonce(header.id, header.from);
        const decipher = createDecipheriv(algorithm, psk, iv);
        return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    }

    export function decodeMeshtasticPacket(raw: Buffer | Uint8Array, psk: Buffer = DEFAULT_PSK): { header: MeshtasticHeader, data: Data } {
        const buf: Buffer = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
        if (buf.length < 16) {
            throw new Error(`Packet too short for header: ${buf.length} bytes`);
        }

        const header = parseHeader(buf);
        const encrypted = buf.subarray(16);
        const decrypted = decryptPayload(encrypted, header, psk);
        const data = Data.decode(decrypted);

        return { header, data };
    }
}