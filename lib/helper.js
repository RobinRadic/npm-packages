"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(require("superagent"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const fs_1 = require("fs");
const path_1 = require("path");
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const log = console.log.bind(console);
const zipFilePath = path_1.resolve(__dirname, '.zepto.zip');
const zeptoDownloadPath = path_1.resolve(__dirname, 'node_modules/zepto-master');
const zeptoPath = path_1.resolve(__dirname, 'node_modules/zepto');
function zepto(cb) {
    if (fs_1.existsSync(zeptoDownloadPath)) {
        fs_extra_1.emptyDirSync(zeptoDownloadPath);
        fs_extra_1.removeSync(zeptoDownloadPath);
    }
    if (fs_1.existsSync(zeptoPath)) {
        fs_extra_1.emptyDirSync(zeptoPath);
        fs_extra_1.removeSync(zeptoPath);
    }
    superagent_1.default
        .get('https://github.com/madrobby/zepto/archive/master.zip')
        .pipe(fs_1.createWriteStream(zipFilePath))
        .on('finish', () => {
        const zip = new adm_zip_1.default(zipFilePath);
        zip.extractEntryTo('zepto-master/', path_1.resolve(__dirname, 'node_modules'), true, true);
        fs_1.renameSync(path_1.resolve(__dirname, 'node_modules/zepto-master'), zeptoPath);
        log('downloaded zip to', zipFilePath);
        child_process_1.execSync(`yarn && yarn dist`, {
            cwd: zeptoPath,
            encoding: 'utf8',
            stdio: 'inherit',
            env: Object.assign(Object.assign({}, process.env), { 'MODULES': 'zepto event form ie' }),
        });
        log('downloaded zip to', zipFilePath);
        if (fs_1.existsSync(zipFilePath)) {
            fs_extra_1.removeSync(zipFilePath);
            log('removed zip from', zipFilePath);
        }
        if (typeof cb === 'function') {
            cb(zeptoPath);
        }
    });
}
if (process.argv.includes('zepto')) {
    zepto();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vcGFja2FnZXMvc3VwZXJtZW51L2hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFvQztBQUNwQyxzREFBMEI7QUFDMUIsMkJBQStEO0FBQy9ELCtCQUErQjtBQUMvQixpREFBeUM7QUFDekMsdUNBQW9EO0FBRXBELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBR3RDLE1BQU0sV0FBVyxHQUFTLGNBQU8sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDM0QsTUFBTSxpQkFBaUIsR0FBRyxjQUFPLENBQUMsU0FBUyxFQUFFLDJCQUEyQixDQUFDLENBQUM7QUFDMUUsTUFBTSxTQUFTLEdBQVcsY0FBTyxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBRW5FLFNBQVMsS0FBSyxDQUFDLEVBQUc7SUFDZCxJQUFLLGVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFHO1FBQ2pDLHVCQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNoQyxxQkFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDakM7SUFDRCxJQUFLLGVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRztRQUN6Qix1QkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hCLHFCQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDekI7SUFDRCxvQkFBVTtTQUNMLEdBQUcsQ0FBQyxzREFBc0QsQ0FBQztTQUMzRCxJQUFJLENBQUMsc0JBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDcEMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFDZixNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDakMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxlQUFlLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEYsZUFBVSxDQUFDLGNBQU8sQ0FBQyxTQUFTLEVBQUUsMkJBQTJCLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN2RSxHQUFHLENBQUMsbUJBQW1CLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdEMsd0JBQVEsQ0FBQyxtQkFBbUIsRUFBRTtZQUMxQixHQUFHLEVBQU8sU0FBUztZQUNuQixRQUFRLEVBQUUsTUFBTTtZQUNoQixLQUFLLEVBQUUsU0FBUztZQUNoQixHQUFHLGtDQUNJLE9BQU8sQ0FBQyxHQUFHLEtBQ2QsU0FBUyxFQUFFLHFCQUFxQixHQUNuQztTQUNKLENBQUMsQ0FBQztRQUNILEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN0QyxJQUFLLGVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRztZQUMzQixxQkFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3hCLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsQ0FBQztTQUN4QztRQUNELElBQUssT0FBTyxFQUFFLEtBQUssVUFBVSxFQUFHO1lBQzVCLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNqQjtJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVELElBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUc7SUFDbEMsS0FBSyxFQUFFLENBQUM7Q0FDWCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzdXBlcmFnZW50IGZyb20gJ3N1cGVyYWdlbnQnO1xuaW1wb3J0IFppcCBmcm9tICdhZG0temlwJztcbmltcG9ydCB7IGNyZWF0ZVdyaXRlU3RyZWFtLCByZW5hbWVTeW5jLCBleGlzdHNTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB7IHJlbW92ZVN5bmMsIGVtcHR5RGlyU3luYyB9IGZyb20gJ2ZzLWV4dHJhJztcblxuY29uc3QgbG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcblxuXG5jb25zdCB6aXBGaWxlUGF0aCAgICAgICA9IHJlc29sdmUoX19kaXJuYW1lLCAnLnplcHRvLnppcCcpO1xuY29uc3QgemVwdG9Eb3dubG9hZFBhdGggPSByZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy96ZXB0by1tYXN0ZXInKTtcbmNvbnN0IHplcHRvUGF0aCAgICAgICAgID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvemVwdG8nKTtcblxuZnVuY3Rpb24gemVwdG8oY2I/KSB7XG4gICAgaWYgKCBleGlzdHNTeW5jKHplcHRvRG93bmxvYWRQYXRoKSApIHtcbiAgICAgICAgZW1wdHlEaXJTeW5jKHplcHRvRG93bmxvYWRQYXRoKTtcbiAgICAgICAgcmVtb3ZlU3luYyh6ZXB0b0Rvd25sb2FkUGF0aCk7XG4gICAgfVxuICAgIGlmICggZXhpc3RzU3luYyh6ZXB0b1BhdGgpICkge1xuICAgICAgICBlbXB0eURpclN5bmMoemVwdG9QYXRoKTtcbiAgICAgICAgcmVtb3ZlU3luYyh6ZXB0b1BhdGgpO1xuICAgIH1cbiAgICBzdXBlcmFnZW50XG4gICAgICAgIC5nZXQoJ2h0dHBzOi8vZ2l0aHViLmNvbS9tYWRyb2JieS96ZXB0by9hcmNoaXZlL21hc3Rlci56aXAnKVxuICAgICAgICAucGlwZShjcmVhdGVXcml0ZVN0cmVhbSh6aXBGaWxlUGF0aCkpXG4gICAgICAgIC5vbignZmluaXNoJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgemlwID0gbmV3IFppcCh6aXBGaWxlUGF0aCk7XG4gICAgICAgICAgICB6aXAuZXh0cmFjdEVudHJ5VG8oJ3plcHRvLW1hc3Rlci8nLCByZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcycpLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgIHJlbmFtZVN5bmMocmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvemVwdG8tbWFzdGVyJyksIHplcHRvUGF0aCk7XG4gICAgICAgICAgICBsb2coJ2Rvd25sb2FkZWQgemlwIHRvJywgemlwRmlsZVBhdGgpO1xuICAgICAgICAgICAgZXhlY1N5bmMoYHlhcm4gJiYgeWFybiBkaXN0YCwge1xuICAgICAgICAgICAgICAgIGN3ZCAgICAgOiB6ZXB0b1BhdGgsXG4gICAgICAgICAgICAgICAgZW5jb2Rpbmc6ICd1dGY4JyxcbiAgICAgICAgICAgICAgICBzdGRpbzogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICAgIGVudjoge1xuICAgICAgICAgICAgICAgICAgICAuLi5wcm9jZXNzLmVudixcbiAgICAgICAgICAgICAgICAgICAgJ01PRFVMRVMnOiAnemVwdG8gZXZlbnQgZm9ybSBpZScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbG9nKCdkb3dubG9hZGVkIHppcCB0bycsIHppcEZpbGVQYXRoKTtcbiAgICAgICAgICAgIGlmICggZXhpc3RzU3luYyh6aXBGaWxlUGF0aCkgKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlU3luYyh6aXBGaWxlUGF0aCk7XG4gICAgICAgICAgICAgICAgbG9nKCdyZW1vdmVkIHppcCBmcm9tJywgemlwRmlsZVBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICAgICAgICAgICAgY2IoemVwdG9QYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59XG5cbmlmICggcHJvY2Vzcy5hcmd2LmluY2x1ZGVzKCd6ZXB0bycpICkge1xuICAgIHplcHRvKCk7XG59XG4iXX0=