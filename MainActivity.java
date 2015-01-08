package luoyw.lenovo.com.guahaoserver;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.telephony.SmsMessage;
import android.text.format.Formatter;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;



public class MainActivity extends Activity {
    private EditText mDeviceIP;
    private EditText mDevicePort;
    private EditText mEditServiceStatus;
    private SmsServer mServer;

    private Object mMsgLock = new Object();
    private String mSmsMsg = "test";
    private Handler mUIHandler = new Handler(Looper.getMainLooper());
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mDeviceIP = (EditText)findViewById(R.id.deviceIP);
        mDevicePort = (EditText)findViewById(R.id.devicePort);
        mEditServiceStatus = (EditText)findViewById(R.id.editServiceStatus);

        Button restart = (Button)findViewById(R.id.restartService);
        restart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startServer();
            }
        });

        WifiManager wm = (WifiManager) getSystemService(WIFI_SERVICE);
        String ip = Formatter.formatIpAddress(wm.getConnectionInfo().getIpAddress());
        mDeviceIP.setText(ip);

        SMSBroadcastReceiver receiver = new SMSBroadcastReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction("android.provider.Telephony.SMS_RECEIVED");
        registerReceiver(receiver, filter);

        startServer();
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (mServer != null) {
            mServer.stop();
            logWithDate("Service Stopped");
        }
    }
    public class SmsServer extends NanoHTTPD {

        public SmsServer(int port) {
            super(port);
        }
        @Override public Response serve(IHTTPSession session) {
            synchronized (mMsgLock) {
                if (mSmsMsg == null) {
                    try {
                        mMsgLock.wait(5000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }

                Response response = new Response(mSmsMsg);
                if (mSmsMsg != null) {
                    logMsgFromThread("Send message:" + mSmsMsg);
                }
                mSmsMsg = null;
                response.addHeader("Access-Control-Allow-Origin", "*");
                return response;
            }
        }
    }

    private void startServer() {
        String strPort = mDevicePort.getText().toString();
        int port = Integer.parseInt(strPort);
        if (mServer != null) {
            mServer.stop();
            logWithDate("Service Stopped");
        }
        mServer = new SmsServer(port);
        try {
            mServer.start();
            logWithDate("Service Started");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void logWithDate(String msg) {
        DateFormat df = new SimpleDateFormat("HH:mm:ss");
        String curTime = df.format(new Date());
        mEditServiceStatus.append(curTime + "   " + msg + "\r\n");
    }

    private void logMsgFromThread(final String msg) {
        mUIHandler.post(new Runnable() {
            @Override
            public void run() {
                logWithDate(msg);
            }
        });
    }

    class SMSBroadcastReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            logMsgFromThread("Received msg");
            Object[] pduses = (Object[]) intent.getExtras().get("pdus");
            for (Object pdus : pduses) {
                byte[] pdusmessage = (byte[])pdus;

                SmsMessage sms = SmsMessage.createFromPdu(pdusmessage);
                String content = sms.getMessageBody();
                synchronized (mMsgLock) {
                    mSmsMsg = content;
                    logMsgFromThread(mSmsMsg);
                }
            }
        }
    }
}



